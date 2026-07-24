"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Shell, Button, Eyebrow, GlassCard } from "@/components/ui";
import { Thread } from "@/components/Thread";
import { MessageCircle, Shield, Timer, Sparkles } from "lucide-react";

const FEATURES = [
  { icon: Sparkles, title: "One card at a time", body: "No feed, no endless scroll. One stranger, one decision." },
  { icon: Timer, title: "Built to end", body: "Every conversation closes after 30 minutes or 100 messages, then it's archived for good." },
  { icon: Shield, title: "Verified, moderated", body: "Phone verification, blocking, reporting, and active moderation from the first message." },
  { icon: MessageCircle, title: "A reason to talk", body: "Icebreakers and conversation starters so you're never staring at a blank box." },
];

const FAQS = [
  { q: "Is this a dating app?", a: "No. There's no browsing, no swiping through profiles, and no searching for people. You get one stranger at a time, for one conversation." },
  { q: "What happens after the chat ends?", a: "It's archived. Neither of you can message again, and you won't be shown to each other again." },
  { q: "Is it anonymous?", a: "You're verified by phone number, but your identity isn't shown to the other person — just your generated profile." },
];

export default function Landing() {
  return (
    <Shell className="max-w-none px-0 py-0">
      <section className="w-full flex flex-col items-center text-center px-6 pt-20 pb-16">
        <Thread size={200} />
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="font-display text-4xl sm:text-5xl leading-[1.1] mt-6 max-w-sm"
        >
          One Stranger.
          <br />
          One Conversation.
          <br />
          One Chance.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-[var(--text-muted)] mt-5 max-w-xs"
        >
          Not a dating app. A place to meet one random person, have one real
          conversation, and let it end there.
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-8"
        >
          <Link href="/login">
            <Button className="px-8 py-4 text-base">Start Talking</Button>
          </Link>
        </motion.div>
      </section>

      <section className="w-full max-w-md mx-auto px-6 py-10">
        <Eyebrow>How it works</Eyebrow>
        <div className="flex flex-col gap-3">
          {[
            "Verify your number and answer a few situational questions.",
            "We generate a profile from your answers — no manual editing.",
            "You see one stranger at a time. Skip or Talk.",
            "If you both say Talk, the chat opens — for 30 minutes, max 100 messages.",
          ].map((step, i) => (
            <GlassCard key={i} className="flex items-start gap-4 py-4">
              <span className="font-display text-[var(--blush)] text-lg">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="text-sm text-[var(--text)]/90">{step}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      <section className="w-full max-w-md mx-auto px-6 py-10">
        <Eyebrow>Why XOXO exists</Eyebrow>
        <p className="text-sm text-[var(--text-muted)] mb-6">
          Endless swiping optimizes for options. XOXO optimizes for one good
          conversation — then lets it go, on purpose.
        </p>
        <div className="grid grid-cols-2 gap-3">
          {FEATURES.map((f) => (
            <GlassCard key={f.title} className="p-4">
              <f.icon size={18} className="text-[var(--gold)] mb-3" />
              <p className="font-medium text-sm mb-1">{f.title}</p>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">{f.body}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      <section className="w-full max-w-md mx-auto px-6 py-10">
        <Eyebrow>FAQ</Eyebrow>
        <div className="flex flex-col gap-3">
          {FAQS.map((f) => (
            <GlassCard key={f.q} className="py-4">
              <p className="font-medium text-sm mb-2">{f.q}</p>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">{f.a}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      <section className="w-full flex flex-col items-center px-6 pb-20 pt-6">
        <Link href="/login">
          <Button className="px-8 py-4 text-base">Start Talking</Button>
        </Link>
        <p className="text-xs text-[var(--text-muted)] mt-4">18+ only · phone verified</p>
      </section>
    </Shell>
  );
}
