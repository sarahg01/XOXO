"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Shell, GlassCard, Button, Eyebrow } from "@/components/ui";
import { useSession } from "@/store/useSession";
import { ArrowLeft, Sparkles } from "lucide-react";

export default function MemoriesPage() {
  const router = useRouter();
  const memories = useSession((s) => s.memories);

  return (
    <Shell>
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.push("/queue")} className="focus-ring rounded-full p-1">
          <ArrowLeft size={18} />
        </button>
        <h1 className="font-display text-xl">Memories</h1>
      </div>

      {memories.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center gap-3">
          <Sparkles size={22} className="text-[var(--text-muted)]" />
          <p className="text-sm text-[var(--text-muted)] max-w-xs">
            Your archived conversations will show up here once one ends.
          </p>
          <Button onClick={() => router.push("/queue")}>Find someone to talk to</Button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {memories.map((m, i) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <GlassCard>
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-sm">{m.strangerName}</p>
                  <span className="text-[11px] text-[var(--text-muted)]">{m.mood}</span>
                </div>
                <p className="text-sm text-[var(--text)]/85 mb-3">{m.oneLine}</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {m.topics.map((t) => (
                    <span
                      key={t}
                      className="text-[11px] px-2.5 py-1 rounded-full bg-[var(--gold)]/15 text-[var(--gold)]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <div className="flex justify-between text-[11px] text-[var(--text-muted)] pt-3 border-t border-white/10">
                  <span>{m.lengthMinutes} min</span>
                  <span>{m.messageCount} messages</span>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      )}
    </Shell>
  );
}
