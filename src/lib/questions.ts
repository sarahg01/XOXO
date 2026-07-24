export type Trait =
  | "chaos"
  | "extrovert"
  | "curiosity"
  | "humor"
  | "nightOwl"
  | "empathy"
  | "patience"
  | "depth";

export type Option = {
  label: string;
  traits: Partial<Record<Trait, number>>;
  topic?: string;
};

export type Question = {
  id: string;
  prompt: string;
  options: Option[];
};

// Pool of questions. Each answer nudges a handful of trait scores.
// Every question includes a neutral/"depends" option with no or minimal
// trait weight, so nobody's forced into a stronger answer than they mean.
// 15-20 are drawn at random per session; the pool is written to grow past
// 60 over time without changing the scoring shape.
export const QUESTION_POOL: Question[] = [
  {
    id: "reply-after-2-months",
    prompt: "Someone replies after 2 months.",
    options: [
      { label: "Ignore", traits: { patience: -2, chaos: 1 } },
      { label: "Reply", traits: { patience: 2, empathy: 1 } },
      { label: "Depends", traits: { curiosity: 1 } },
      { label: "Read and forget", traits: { chaos: 2, patience: -1 } },
    ],
  },
  {
    id: "one-value",
    prompt: "Choose one.",
    options: [
      { label: "Money", traits: { chaos: 1 }, topic: "ambition" },
      { label: "Love", traits: { empathy: 2 }, topic: "relationships" },
      { label: "Peace", traits: { patience: 2 }, topic: "calm" },
      { label: "Success", traits: { extrovert: 1 }, topic: "ambition" },
      { label: "Depends on the day", traits: {} },
    ],
  },
  {
    id: "morning-night",
    prompt: "Morning or Night",
    options: [
      { label: "Morning", traits: { nightOwl: -2, patience: 1 } },
      { label: "Night", traits: { nightOwl: 2, depth: 1 } },
      { label: "Honestly, both", traits: {} },
    ],
  },
  {
    id: "dogs-cats",
    prompt: "Dogs or Cats",
    options: [
      { label: "Dogs", traits: { extrovert: 1 }, topic: "animals" },
      { label: "Cats", traits: { depth: 1 }, topic: "animals" },
      { label: "Love them both equally", traits: {}, topic: "animals" },
    ],
  },
  {
    id: "call-text",
    prompt: "Call or Text",
    options: [
      { label: "Call", traits: { extrovert: 2 } },
      { label: "Text", traits: { extrovert: -1, patience: 1 } },
      { label: "Either works", traits: {} },
    ],
  },
  {
    id: "tea-coffee",
    prompt: "Tea or Coffee",
    options: [
      { label: "Tea", traits: { patience: 1 }, topic: "coffee & tea" },
      { label: "Coffee", traits: { chaos: 1 }, topic: "coffee & tea" },
      { label: "Both, depending on the day", traits: {}, topic: "coffee & tea" },
    ],
  },
  {
    id: "biggest-fear",
    prompt: "Your biggest fear?",
    options: [
      { label: "Being forgotten", traits: { depth: 2, empathy: 1 } },
      { label: "Failure", traits: { chaos: -1, extrovert: 1 } },
      { label: "Being alone", traits: { empathy: 2 } },
      { label: "Judgement", traits: { depth: 1 } },
      { label: "Honestly, none of these", traits: {} },
    ],
  },
  {
    id: "friday-night",
    prompt: "Your Friday night?",
    options: [
      { label: "Gaming", traits: { chaos: 1 }, topic: "gaming" },
      { label: "Movies", traits: { depth: 1 }, topic: "movies" },
      { label: "Books", traits: { depth: 2, extrovert: -1 }, topic: "books" },
      { label: "Party", traits: { extrovert: 2, chaos: 1 }, topic: "nightlife" },
      { label: "Sleep", traits: { patience: 1, nightOwl: -1 } },
      { label: "Depends on the week", traits: {} },
    ],
  },
  {
    id: "ten-lakh",
    prompt: "What would you spend ₹10 lakh on?",
    options: [
      { label: "Travel", traits: { curiosity: 2 }, topic: "travel" },
      { label: "House", traits: { patience: 1 } },
      { label: "Parents", traits: { empathy: 2 } },
      { label: "Business", traits: { chaos: 1, extrovert: 1 }, topic: "ambition" },
      { label: "Shopping", traits: { chaos: 1 } },
      { label: "A mix of all of these", traits: {} },
    ],
  },
  {
    id: "vibe",
    prompt: "Choose your vibe",
    options: [
      { label: "Chaotic", traits: { chaos: 3 } },
      { label: "Calm", traits: { chaos: -3, patience: 2 } },
      { label: "Funny", traits: { humor: 3 } },
      { label: "Deep", traits: { depth: 3 } },
      { label: "Curious", traits: { curiosity: 3 } },
      { label: "Creative", traits: { chaos: 1, curiosity: 1 } },
      { label: "A bit of everything", traits: {} },
    ],
  },
  {
    id: "favorite-activity",
    prompt: "Favorite activity",
    options: [
      { label: "Gaming", traits: { chaos: 1 }, topic: "gaming" },
      { label: "Cooking", traits: { patience: 1 }, topic: "food" },
      { label: "Gym", traits: { extrovert: 1 }, topic: "fitness" },
      { label: "Reading", traits: { depth: 2, extrovert: -1 }, topic: "books" },
      { label: "Anime", traits: { curiosity: 1 }, topic: "anime" },
      { label: "Coding", traits: { patience: 1, depth: 1 }, topic: "tech" },
      { label: "Something else entirely", traits: {} },
    ],
  },
  {
    id: "strangers-friends",
    prompt: "Do you believe strangers can become friends?",
    options: [
      { label: "Yes", traits: { extrovert: 2, empathy: 1 } },
      { label: "No", traits: { extrovert: -2 } },
      { label: "Maybe", traits: { curiosity: 1 } },
    ],
  },
  {
    id: "someone-cries",
    prompt: "If someone cries in front of you...",
    options: [
      { label: "Comfort", traits: { empathy: 3 } },
      { label: "Advice", traits: { depth: 1 } },
      { label: "Stay silent", traits: { empathy: -1, patience: 1 } },
      { label: "Leave", traits: { extrovert: -2 } },
      { label: "Depends who it is", traits: {} },
    ],
  },
  {
    id: "instant-dislike",
    prompt: "What makes you instantly dislike someone?",
    options: [
      { label: "Lying", traits: { empathy: 1 } },
      { label: "Ego", traits: { chaos: -1 } },
      { label: "Rudeness", traits: { empathy: 1 } },
      { label: "Dry texting", traits: { extrovert: 1, patience: -1 } },
      { label: "Nothing specific, depends", traits: {} },
    ],
  },
  {
    id: "conversation-style",
    prompt: "Ideal conversation?",
    options: [
      { label: "Debating ideas", traits: { depth: 2, curiosity: 2 }, topic: "ideas" },
      { label: "Trading memes", traits: { humor: 3, chaos: 1 }, topic: "internet culture" },
      { label: "Venting", traits: { empathy: 2 } },
      { label: "Planning something", traits: { patience: 1 } },
      { label: "Whatever the moment calls for", traits: {} },
    ],
  },
  {
    id: "weekend-plan",
    prompt: "Perfect weekend?",
    options: [
      { label: "Road trip", traits: { chaos: 2, curiosity: 1 }, topic: "travel" },
      { label: "Nothing planned", traits: { patience: 2, nightOwl: 1 } },
      { label: "Concert", traits: { extrovert: 2 }, topic: "music" },
      { label: "Deep cleaning", traits: { patience: 2 } },
      { label: "Depends on my mood", traits: {} },
    ],
  },
  {
    id: "argument-style",
    prompt: "Mid-argument, you tend to...",
    options: [
      { label: "Go quiet", traits: { extrovert: -2, patience: 1 } },
      { label: "Push back", traits: { chaos: 1, extrovert: 1 } },
      { label: "Try to joke it off", traits: { humor: 2 } },
      { label: "Ask questions", traits: { curiosity: 2, empathy: 1 } },
      { label: "Depends who it's with", traits: {} },
    ],
  },
  {
    id: "new-city",
    prompt: "First thing you do in a new city?",
    options: [
      { label: "Find the food", traits: { curiosity: 1 }, topic: "food" },
      { label: "Get lost on purpose", traits: { chaos: 2, curiosity: 2 }, topic: "travel" },
      { label: "Museum", traits: { depth: 2 } },
      { label: "Nap", traits: { nightOwl: 1, patience: 1 } },
      { label: "Whatever feels right in the moment", traits: {} },
    ],
  },
  {
    id: "music-taste",
    prompt: "Your music right now?",
    options: [
      { label: "Sad indie", traits: { depth: 2 }, topic: "music" },
      { label: "Loud and fast", traits: { chaos: 2 }, topic: "music" },
      { label: "Whatever's trending", traits: { extrovert: 1 }, topic: "music" },
      { label: "Same 5 songs on repeat", traits: { patience: 2 }, topic: "music" },
      { label: "It changes every week", traits: {}, topic: "music" },
    ],
  },
  {
    id: "text-back-time",
    prompt: "How fast do you usually text back?",
    options: [
      { label: "Instantly", traits: { extrovert: 2, patience: -1 } },
      { label: "Within the hour", traits: { patience: 1 } },
      { label: "Whenever I remember", traits: { chaos: 1, patience: -1 } },
      { label: "I forget I have a phone", traits: { nightOwl: 1, chaos: 1 } },
      { label: "Depends who's texting", traits: {} },
    ],
  },
  {
    id: "compliment-response",
    prompt: "Someone compliments you out of nowhere.",
    options: [
      { label: "Deflect immediately", traits: { extrovert: -1, humor: 1 } },
      { label: "Say thank you and move on", traits: { patience: 1 } },
      { label: "Overthink it for a week", traits: { depth: 2 } },
      { label: "Compliment them back", traits: { empathy: 2, extrovert: 1 } },
      { label: "Depends on my mood that day", traits: {} },
    ],
  },
  {
    id: "conflict-with-friend",
    prompt: "A friend cancels last minute, again.",
    options: [
      { label: "Say it's fine (it's not)", traits: { empathy: 1, patience: -1 } },
      { label: "Call it out directly", traits: { chaos: 1, curiosity: 1 } },
      { label: "Quietly distance", traits: { extrovert: -2 } },
      { label: "Genuinely don't mind", traits: { patience: 2 } },
      { label: "Depends how often it happens", traits: {} },
    ],
  },
  {
    id: "ideal-sunday",
    prompt: "Ideal Sunday?",
    options: [
      { label: "Long walk, no phone", traits: { depth: 1, patience: 1 } },
      { label: "Marathon of a show", traits: { nightOwl: 1 }, topic: "shows" },
      { label: "Brunch with people", traits: { extrovert: 2 }, topic: "food" },
      { label: "Catching up on everything I ignored all week", traits: { chaos: 1 } },
      { label: "Depends on the week I've had", traits: {} },
    ],
  },
  {
    id: "text-k-period",
    prompt: "Toxic or green flag: they reply 'k.' to your whole paragraph.",
    options: [
      { label: "Immediate ick", traits: { patience: -1, chaos: 1 } },
      { label: "Depends on the day", traits: { curiosity: 1 } },
      { label: "Doesn't bother me", traits: { patience: 2 } },
      { label: "Honestly I'd do the same", traits: { chaos: 1 } },
    ],
  },
  {
    id: "friends-ex-dms",
    prompt: "Toxic or green flag: your friend's ex slides into your DMs.",
    options: [
      { label: "Tell my friend immediately", traits: { empathy: 2 } },
      { label: "Politely decline, move on", traits: { patience: 1 } },
      { label: "Entertain it a little", traits: { chaos: 2 } },
      { label: "Ask my friend first", traits: { empathy: 1 } },
      { label: "Depends on the situation", traits: {} },
    ],
  },
  {
    id: "energy-source",
    prompt: "What recharges you?",
    options: [
      { label: "Time alone", traits: { extrovert: -2 } },
      { label: "Being around people", traits: { extrovert: 2 } },
      { label: "A good conversation", traits: { depth: 1, empathy: 1 } },
      { label: "Doing nothing at all", traits: { nightOwl: 1, patience: 1 } },
      { label: "A bit of both", traits: {} },
    ],
  },
  {
    id: "response-to-silence",
    prompt: "A conversation goes quiet for a minute.",
    options: [
      { label: "Comfortable, no need to fill it", traits: { patience: 2 } },
      { label: "I immediately say something", traits: { chaos: 1, extrovert: 1 } },
      { label: "I start overanalyzing it", traits: { depth: 1 } },
      { label: "I make a joke", traits: { humor: 2 } },
      { label: "Depends who I'm with", traits: {} },
    ],
  },
  {
    id: "topic-you-could-talk-forever",
    prompt: "You could talk for hours about...",
    options: [
      { label: "Movies & shows", traits: { curiosity: 1 }, topic: "movies" },
      { label: "Sports", traits: { extrovert: 1 }, topic: "sports" },
      { label: "Philosophy / big questions", traits: { depth: 3 }, topic: "ideas" },
      { label: "Gossip", traits: { extrovert: 1, humor: 1 }, topic: "people" },
      { label: "Tech & AI", traits: { curiosity: 1 }, topic: "tech" },
      { label: "Honestly, anything", traits: {} },
    ],
  },
  {
    id: "apology-style",
    prompt: "When you're wrong, you...",
    options: [
      { label: "Apologize fast", traits: { empathy: 2 } },
      { label: "Need a minute first", traits: { patience: 1 } },
      { label: "Get defensive before admitting it", traits: { chaos: 1 } },
      { label: "Show it rather than say it", traits: { depth: 1 } },
      { label: "Depends on the situation", traits: {} },
    ],
  },
  {
    id: "ideal-stranger-chat",
    prompt: "What do you want from a stranger conversation?",
    options: [
      { label: "Something honest neither of us would usually say", traits: { depth: 3 } },
      { label: "A genuinely funny half hour", traits: { humor: 3 } },
      { label: "Just curious what a random person thinks", traits: { curiosity: 3 } },
      { label: "Whatever happens, happens", traits: { chaos: 2 } },
      { label: "I genuinely don't know until it happens", traits: {} },
    ],
  },
];
