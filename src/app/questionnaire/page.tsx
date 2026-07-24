"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { QUESTION_POOL, Question } from "@/lib/questions";
import { useSession } from "@/store/useSession";
import { Shell, Eyebrow } from "@/components/ui";
import { Thread } from "@/components/Thread";

function pickQuestions(): Question[] {
  const count = 15 + Math.floor(Math.random() * 6); // 15-20
  const shuffled = [...QUESTION_POOL].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export default function QuestionnairePage() {
  const router = useRouter();
  const setAnswer = useSession((s) => s.setAnswer);
  const answers = useSession((s) => s.answers);
  const username = useSession((s) => s.username);

  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [index, setIndex] = useState(0);
  // tracks the option just tapped, purely to drive the brief highlight + auto-advance animation
  const [justPicked, setJustPicked] = useState<string | null>(null);

  useEffect(() => {
    if (!username) {
      router.replace("/username");
      return;
    }
    setQuestions(pickQuestions());
  }, [username, router]);

  const current = questions?.[index];
  const progress = questions ? (index / questions.length) * 100 : 0;
  const savedAnswer = current ? answers[current.id] : undefined;

  const handleSelect = (label: string) => {
    if (!current) return;
    const alreadyOnThisAnswer = savedAnswer === label;
    setAnswer(current.id, label);
    setJustPicked(label);

    // Only auto-advance when this question hadn't already been answered this way
    // (so re-picking the same answer while reviewing doesn't force you forward).
    if (alreadyOnThisAnswer) return;

    setTimeout(() => {
      setJustPicked(null);
      if (questions && index + 1 < questions.length) {
        setIndex((i) => i + 1);
      } else {
        router.push("/generating");
      }
    }, 260);
  };

  const handleBack = () => {
    setJustPicked(null);
    if (index > 0) {
      setIndex((i) => i - 1);
    } else {
      router.push("/username");
    }
  };

  const handleContinue = () => {
    if (!questions) return;
    setJustPicked(null);
    if (index + 1 < questions.length) {
      setIndex((i) => i + 1);
    } else {
      router.push("/generating");
    }
  };

  if (!questions || !current) {
    return (
      <Shell className="items-center justify-center">
        <Thread size={160} />
      </Shell>
    );
  }

  const highlighted = justPicked ?? savedAnswer;

  return (
    <Shell>
      <div className="w-full h-1 rounded-full bg-white/[0.06] overflow-hidden mb-6">
        <motion.div
          className="h-full bg-gradient-to-r from-[var(--gold)] to-[var(--blush)]"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <div className="flex items-center justify-between mb-2">
        <button
          onClick={handleBack}
          className="focus-ring flex items-center gap-1 text-xs text-[var(--text-muted)] hover:text-[var(--text)] rounded-lg py-1 pr-2 -ml-1"
        >
          <ArrowLeft size={14} /> Back
        </button>
        <Eyebrow>
          Question {index + 1} of {questions.length}
        </Eyebrow>
      </div>

      <div className="flex-1 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <h2 className="font-display text-2xl leading-snug mb-8">
              {current.prompt}
            </h2>

            <div className="flex flex-col gap-3">
              {current.options.map((opt) => {
                const isSelected = highlighted === opt.label;
                return (
                  <button
                    key={opt.label}
                    onClick={() => handleSelect(opt.label)}
                    className={
                      "focus-ring text-left rounded-2xl px-5 py-4 glass transition-all " +
                      (isSelected
                        ? "border-[var(--blush)]/60 bg-[var(--blush)]/10"
                        : "hover:bg-white/[0.08] hover:border-white/20")
                    }
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>

            {savedAnswer && (
              <button
                onClick={handleContinue}
                className="focus-ring text-xs text-[var(--text-muted)] hover:text-[var(--text)] mt-5"
              >
                Keep this answer and continue →
              </button>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </Shell>
  );
}
