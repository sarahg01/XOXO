"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Shell, Button, Eyebrow } from "@/components/ui";
import { Thread } from "@/components/Thread";
import { ProfileCard } from "@/components/ProfileCard";
import { IdentityCard } from "@/components/IdentityCard";
import { useSession } from "@/store/useSession";
import { generateProfile } from "@/lib/generateProfile";
import { zodiacLabel } from "@/lib/zodiac";

const STEPS = [
  "Reading your answers",
  "Mapping your conversation style",
  "Calculating curiosity & empathy",
  "Writing your bio",
];

export default function GeneratingPage() {
  const router = useRouter();
  const username = useSession((s) => s.username);
  const age = useSession((s) => s.age);
  const zodiac = useSession((s) => s.zodiac);
  const answers = useSession((s) => s.answers);
  const profile = useSession((s) => s.profile);
  const setProfile = useSession((s) => s.setProfile);

  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!username || !age || !zodiac) {
      router.replace("/username");
      return;
    }
    const interval = setInterval(() => {
      setStep((s) => {
        if (s >= STEPS.length - 1) {
          clearInterval(interval);
          const stats = generateProfile(username, age, answers);
          setProfile({
            ...stats,
            name: username,
            age,
            zodiac: zodiacLabel(zodiac),
          });
          setTimeout(() => setDone(true), 400);
          return s;
        }
        return s + 1;
      });
    }, 550);
    return () => clearInterval(interval);
  }, [username, age, zodiac, answers, setProfile, router]);

  if (!done || !profile) {
    return (
      <Shell className="items-center justify-center text-center">
        <Thread size={180} />
        <Eyebrow>Step 4 of 5</Eyebrow>
        <h1 className="font-display text-2xl mb-8">Generating your profile</h1>
        <div className="flex flex-col gap-3 w-full">
          {STEPS.map((s, i) => (
            <motion.div
              key={s}
              animate={{ opacity: i <= step ? 1 : 0.3 }}
              className="text-sm text-[var(--text-muted)] flex items-center gap-3"
            >
              <span
                className={
                  "w-1.5 h-1.5 rounded-full " +
                  (i <= step ? "bg-[var(--blush)]" : "bg-white/20")
                }
              />
              {s}
            </motion.div>
          ))}
        </div>
      </Shell>
    );
  }

  return (
    <Shell className="items-center text-center">
      <Eyebrow>Your identity is ready</Eyebrow>
      <h1 className="font-display text-2xl mb-6">This is you, to strangers.</h1>
      <div className="w-full mb-4">
        <IdentityCard profile={profile} />
      </div>
      <ProfileCard profile={profile} />
      <p className="text-xs text-[var(--text-muted)] mt-4 mb-6">
        Generated entirely from your answers — nothing to edit.
      </p>
      <Button onClick={() => router.push("/queue")} className="w-full">
        Enter the queue
      </Button>
    </Shell>
  );
}
