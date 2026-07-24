"use client";

import { DisplayProfile } from "@/lib/generateProfile";
import { GlassCard } from "./ui";

function StatBar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex justify-between text-xs text-[var(--text-muted)] mb-1">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[var(--gold)] to-[var(--blush)]"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

export function ProfileCard({ profile }: { profile: DisplayProfile }) {
  return (
    <GlassCard className="w-full">
      <div className="flex items-baseline justify-between mb-1">
        <h2 className="font-display text-2xl">{profile.name}, {profile.age}</h2>
        <span className="text-sm text-[var(--text-muted)]">{profile.zodiac}</span>
      </div>
      <p className="text-sm text-[var(--text)]/85 leading-relaxed mb-5">
        {profile.bio}
      </p>

      <div className="flex flex-wrap gap-2 mb-5">
        {profile.likes.map((l) => (
          <span
            key={l}
            className="text-xs px-3 py-1.5 rounded-full bg-[var(--gold)]/15 text-[var(--gold)] border border-[var(--gold)]/20"
          >
            {l}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 mb-5">
        <div>
          <p className="text-xs text-[var(--blush)] mb-1.5">Green Flags</p>
          <ul className="text-xs text-[var(--text)]/80 space-y-1">
            {profile.greenFlags.map((f) => (
              <li key={f}>· {f}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs text-[var(--danger)] mb-1.5">Red Flags</p>
          <ul className="text-xs text-[var(--text)]/80 space-y-1">
            {profile.redFlags.map((f) => (
              <li key={f}>· {f}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex flex-col gap-3 mb-5">
        <StatBar label="Curiosity" value={profile.curiosityLevel} />
        <StatBar label="Empathy" value={profile.empathyPct} />
        <StatBar label="Extroversion" value={profile.introvertExtrovertPct} />
        <StatBar label="Night Owl" value={profile.nightOwlPct} />
      </div>

      <div className="flex items-center justify-between text-xs text-[var(--text-muted)] pt-4 border-t border-white/10">
        <span>{profile.conversationStyle}</span>
        <span>Chaos {profile.chaosLevel}/10</span>
        <span>Humor {profile.humorScore}/10</span>
      </div>
    </GlassCard>
  );
}
