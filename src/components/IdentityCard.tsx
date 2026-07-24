"use client";

import { motion } from "framer-motion";
import { BadgeCheck } from "lucide-react";
import { DisplayProfile } from "@/lib/generateProfile";

function hashToId(seed: string): string {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
  const num = Math.abs(h).toString(36).toUpperCase().slice(0, 6).padStart(6, "0");
  return `XOXO-${num}`;
}

function Barcode() {
  const bars = Array.from({ length: 28 }, (_, i) => (i * 7 + 3) % 4 || 1);
  return (
    <div className="flex items-end gap-[2px] h-6 opacity-70">
      {bars.map((w, i) => (
        <div
          key={i}
          className="bg-white/60"
          style={{ width: 1.5, height: `${8 + w * 4}px` }}
        />
      ))}
    </div>
  );
}

export function IdentityCard({ profile }: { profile: DisplayProfile }) {
  const idNumber = hashToId(profile.name + profile.age + profile.zodiac);
  const issued = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const initial = profile.name.charAt(0).toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, rotateX: -8 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full rounded-3xl overflow-hidden glass relative"
      style={{ perspective: 800 }}
    >
      <div className="h-2 w-full bg-gradient-to-r from-[var(--gold)] via-[var(--rose)] to-[var(--blush)]" />

      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <span className="font-display text-sm tracking-[0.3em] text-[var(--text-muted)]">
            XOXO
          </span>
          <span className="flex items-center gap-1 text-[11px] text-[var(--blush)] bg-[var(--blush)]/10 border border-[var(--blush)]/25 rounded-full px-2.5 py-1">
            <BadgeCheck size={12} /> Verified
          </span>
        </div>

        <div className="flex items-center gap-4 mb-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--gold)] to-[var(--rose)] flex items-center justify-center font-display text-2xl text-white shrink-0">
            {initial}
          </div>
          <div>
            <p className="font-display text-xl leading-tight">
              {profile.name}, {profile.age}
            </p>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">{profile.zodiac}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs mb-5">
          <div className="glass rounded-xl px-3 py-2">
            <p className="text-[var(--text-muted)] mb-0.5">ID Number</p>
            <p className="font-mono">{idNumber}</p>
          </div>
          <div className="glass rounded-xl px-3 py-2">
            <p className="text-[var(--text-muted)] mb-0.5">Issued</p>
            <p>{issued}</p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-dashed border-white/15">
          <p className="text-[10px] text-[var(--text-muted)] max-w-[55%]">
            Your bio and stats below are generated from your answers.
          </p>
          <Barcode />
        </div>
      </div>
    </motion.div>
  );
}

