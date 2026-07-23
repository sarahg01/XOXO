"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Shell, Button, Eyebrow } from "@/components/ui";
import { ProfileCard } from "@/components/ProfileCard";
import { useSession } from "@/store/useSession";
import { pickRandomStranger } from "@/lib/strangers";
import { Thread } from "@/components/Thread";
import { SkipForward, MessageCircle } from "lucide-react";

export default function QueuePage() {
  const router = useRouter();
  const profile = useSession((s) => s.profile);
  const currentStranger = useSession((s) => s.currentStranger);
  const setCurrentStranger = useSession((s) => s.setCurrentStranger);
  const skipCurrent = useSession((s) => s.skipCurrent);
  const talkCurrent = useSession((s) => s.talkCurrent);
  const skippedIds = useSession((s) => s.skippedIds);
  const resetChat = useSession((s) => s.resetChat);

  const [empty, setEmpty] = useState(false);
  const [matching, setMatching] = useState(false);

  useEffect(() => {
    if (!profile) {
      router.replace("/generating");
      return;
    }
    resetChat();
    const next = pickRandomStranger([]);
    setCurrentStranger(next);
    setEmpty(!next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);

  const handleSkip = () => {
    if (!currentStranger) return;
    const excluded = [...skippedIds, currentStranger.id];
    skipCurrent();
    const next = pickRandomStranger(excluded);
    setTimeout(() => {
      setCurrentStranger(next);
      setEmpty(!next);
    }, 150);
  };

  const handleTalk = () => {
    if (!currentStranger) return;
    setMatching(true);
    talkCurrent();
    setTimeout(() => {
      router.push(`/chat/${currentStranger.id}`);
    }, 1400);
  };

  if (!profile) return null;

  if (matching && currentStranger) {
    return (
      <Shell className="items-center justify-center text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 14 }}
        >
          <Thread size={200} />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="font-display text-2xl mt-4"
        >
          It's a match
        </motion.h1>
        <p className="text-sm text-[var(--text-muted)] mt-2">
          Opening your conversation with {currentStranger.name}...
        </p>
      </Shell>
    );
  }

  return (
    <Shell className="items-center">
      <Eyebrow>Step 5 of 5</Eyebrow>
      <h1 className="font-display text-2xl mb-6 text-center">One stranger.</h1>

      <div className="flex-1 w-full flex items-center justify-center">
        <AnimatePresence mode="wait">
          {currentStranger ? (
            <motion.div
              key={currentStranger.id}
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: -80, rotate: -4 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="w-full"
            >
              <ProfileCard profile={currentStranger} />
            </motion.div>
          ) : (
            <div className="text-center text-[var(--text-muted)] text-sm">
              No one new right now — check back soon.
            </div>
          )}
        </AnimatePresence>
      </div>

      {currentStranger && (
        <div className="w-full flex gap-3 mt-6">
          <Button variant="secondary" className="flex-1" onClick={handleSkip}>
            <SkipForward size={16} /> Skip
          </Button>
          <Button className="flex-1" onClick={handleTalk}>
            <MessageCircle size={16} /> Talk
          </Button>
        </div>
      )}
    </Shell>
  );
}
