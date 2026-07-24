import { QUESTION_POOL, Trait, Question } from "./questions";

// Everything here is derived from questionnaire answers. Identity fields
// (name, age, zodiac) are supplied directly by the user, never generated —
// see DisplayProfile below, which is what's actually rendered on cards.
export type GeneratedProfile = {
  bio: string;
  likes: string[];
  dislikes: string[];
  greenFlags: string[];
  redFlags: string[];
  conversationStyle: string;
  communicationType: string;
  conversationEnergy: number; // 1-5 stars
  curiosityLevel: number; // %
  chaosLevel: number; // 0-10
  friendshipPotential: number; // %
  humorScore: number; // 0-10
  introvertExtrovertPct: number; // % extrovert
  nightOwlPct: number; // %
  empathyPct: number; // %
  patiencePct: number; // %
  responseSpeed: "Instant" | "Quick" | "Relaxed" | "Whenever";
  favoriteTopics: string[];
  conversationStarters: string[];
};

// The shape actually shown on profile cards: user-provided identity fields
// combined with the generated stats above.
export type DisplayProfile = GeneratedProfile & {
  name: string; // the nickname the user typed, shown as-is
  age: number; // entered by the user
  zodiac: string; // chosen by the user, e.g. "♋ Cancer"
};

function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashSeed(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) | 0;
  }
  return h;
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

const BIO_TEMPLATES: Array<(t: Traits) => string> = [
  (t) =>
    `A${t.nightOwl > 55 ? "n introverted" : " curious"} ${
      t.nightOwl > 55 ? "night owl" : "early riser"
    } who secretly enjoys ${
      t.depth > 55 ? "deep conversations" : "good banter"
    } more than small talk.`,
  (t) =>
    `${t.chaos > 60 ? "Chaotic on purpose" : "Calm by default"}, ${
      t.humor > 55 ? "funnier than they let on" : "quieter than they seem"
    }, and always up for one honest conversation.`,
  (t) =>
    `${t.extrovert > 55 ? "Talks to strangers on purpose" : "Picks conversations carefully"} — ${
      t.curiosity > 55 ? "endlessly curious" : "comfortable with silence"
    } and ${t.empathy > 55 ? "a genuinely good listener" : "brutally honest when it counts"}.`,
];

type Traits = Record<Trait, number>;

export function generateProfile(
  seedName: string,
  seedAge: number,
  answers: Record<string, string>
): GeneratedProfile {
  const seed = hashSeed(seedName + seedAge + Object.values(answers).join("|"));
  const rand = mulberry32(seed);

  // Aggregate trait deltas from answered questions.
  const totals: Traits = {
    chaos: 0,
    extrovert: 0,
    curiosity: 0,
    humor: 0,
    nightOwl: 0,
    empathy: 0,
    patience: 0,
    depth: 0,
  };
  const topicCounts = new Map<string, number>();
  let answeredCount = 0;

  for (const [qId, optionLabel] of Object.entries(answers)) {
    const q = QUESTION_POOL.find((q: Question) => q.id === qId);
    const opt = q?.options.find((o) => o.label === optionLabel);
    if (!q || !opt) continue;
    answeredCount++;
    for (const [trait, val] of Object.entries(opt.traits)) {
      totals[trait as Trait] += val ?? 0;
    }
    if (opt.topic) {
      topicCounts.set(opt.topic, (topicCounts.get(opt.topic) ?? 0) + 1);
    }
  }

  const n = Math.max(1, answeredCount);
  // Normalize each trait to a 0-100 scale using a gentle logistic-ish curve.
  const norm = (raw: number, spread = 3) =>
    clamp(50 + (raw / n) * (100 / spread), 0, 100);

  const extrovertPct = Math.round(norm(totals.extrovert));
  const nightOwlPct = Math.round(norm(totals.nightOwl));
  const empathyPct = Math.round(norm(totals.empathy));
  const patiencePct = Math.round(norm(totals.patience));
  const curiosityPct = Math.round(norm(totals.curiosity));
  const chaosLevel = Math.round(clamp(5 + totals.chaos, 0, 10));
  const humorScore = Math.round(clamp(5 + totals.humor, 0, 10));
  const depthPct = Math.round(norm(totals.depth));

  const traits: Traits = {
    chaos: chaosLevel * 10,
    extrovert: extrovertPct,
    curiosity: curiosityPct,
    humor: humorScore * 10,
    nightOwl: nightOwlPct,
    empathy: empathyPct,
    patience: patiencePct,
    depth: depthPct,
  };

  const bio = BIO_TEMPLATES[Math.floor(rand() * BIO_TEMPLATES.length)](traits);

  const topics = [...topicCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([t]) => t);
  const fallbackTopics = ["random tangents", "late-night thoughts", "life updates"];
  const favoriteTopics = (topics.length ? topics : fallbackTopics).slice(0, 4);

  const likesPool = [
    "music", "long walks", "spontaneous plans", "deep talks", "good food",
    "overthinking", "quiet mornings", "loud playlists", "new places", "board games",
  ];
  const likes = Array.from({ length: 4 }, () =>
    likesPool[Math.floor(rand() * likesPool.length)]
  ).filter((v, i, arr) => arr.indexOf(v) === i).slice(0, 4);

  const dislikesPool = [
    "dry texting", "small talk", "being rushed", "flaky plans",
    "loud chewing", "unnecessary drama", "waiting too long for replies",
  ];
  const dislikes = Array.from({ length: 3 }, () =>
    dislikesPool[Math.floor(rand() * dislikesPool.length)]
  ).filter((v, i, arr) => arr.indexOf(v) === i).slice(0, 3);

  const greenFlagsPool = ["Honest", "Funny", "Supportive", "Good listener", "Curious", "Direct"];
  const greenFlags = Array.from({ length: 3 }, () =>
    greenFlagsPool[Math.floor(rand() * greenFlagsPool.length)]
  ).filter((v, i, arr) => arr.indexOf(v) === i).slice(0, 3);

  const redFlagsPool = ["Replies late", "Sleeps at 4AM", "Overthinks everything", "Too blunt", "Easily distracted"];
  const redFlags = Array.from({ length: 2 }, () =>
    redFlagsPool[Math.floor(rand() * redFlagsPool.length)]
  ).filter((v, i, arr) => arr.indexOf(v) === i).slice(0, 2);

  const conversationStyle =
    depthPct > 60 ? "Deep & reflective" : chaosLevel > 6 ? "Chaotic & spontaneous" : humorScore > 6 ? "Playful & witty" : "Easygoing";

  const communicationType =
    extrovertPct > 60 ? "Direct communicator" : "Thoughtful communicator";

  const responseSpeed: GeneratedProfile["responseSpeed"] =
    patiencePct < 40 ? "Instant" : patiencePct < 60 ? "Quick" : patiencePct < 80 ? "Relaxed" : "Whenever";

  const starterPool = [
    "What would you do if you won ₹50 crore tomorrow?",
    "What's a belief you've completely changed your mind about?",
    "What's something you're weirdly good at?",
    "If tonight was the only chance you'd ever get to talk to me, what would you ask?",
    "What's the most interesting thing that happened to you this week?",
  ];
  const conversationStarters = Array.from({ length: 3 }, () =>
    starterPool[Math.floor(rand() * starterPool.length)]
  ).filter((v, i, arr) => arr.indexOf(v) === i);

  return {
    bio,
    likes,
    dislikes,
    greenFlags,
    redFlags,
    conversationStyle,
    communicationType,
    conversationEnergy: clamp(Math.round((extrovertPct / 100) * 5), 1, 5),
    curiosityLevel: curiosityPct,
    chaosLevel,
    friendshipPotential: Math.round(clamp((empathyPct + curiosityPct) / 2, 0, 100)),
    humorScore,
    introvertExtrovertPct: extrovertPct,
    nightOwlPct,
    empathyPct,
    patiencePct,
    responseSpeed,
    favoriteTopics,
    conversationStarters,
  };
}
