"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Shell, GlassCard, Button, Eyebrow } from "@/components/ui";
import { useSession } from "@/store/useSession";
import { ZODIACS } from "@/lib/zodiac";

export default function UsernamePage() {
  const router = useRouter();
  const otpVerified = useSession((s) => s.otpVerified);
  const setUsername = useSession((s) => s.setUsername);
  const setAge = useSession((s) => s.setAge);
  const setZodiac = useSession((s) => s.setZodiac);

  const [nickname, setNickname] = useState("");
  const [age, setAgeValue] = useState("");
  const [zodiac, setZodiacValue] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!otpVerified) router.replace("/login");
  }, [otpVerified, router]);

  const handleContinue = () => {
    const trimmed = nickname.trim();
    if (trimmed.length < 3) {
      setError("Nickname needs at least 3 characters.");
      return;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(trimmed)) {
      setError("Letters, numbers, and underscores only.");
      return;
    }
    const ageNum = parseInt(age, 10);
    if (!age || Number.isNaN(ageNum)) {
      setError("Enter your age.");
      return;
    }
    if (ageNum < 18 || ageNum > 100) {
      setError("You must be 18 or older to use XOXO.");
      return;
    }
    if (!zodiac) {
      setError("Pick your zodiac sign.");
      return;
    }
    setUsername(trimmed);
    setAge(ageNum);
    setZodiac(zodiac);
    router.push("/questionnaire");
  };

  return (
    <Shell className="items-center justify-center text-center">
      <Eyebrow>Step 3 of 5</Eyebrow>
      <h1 className="font-display text-2xl mb-2">Who are you to strangers?</h1>
      <p className="text-sm text-[var(--text-muted)] mb-8 max-w-xs">
        Your nickname, age, and sign are shown exactly as you enter them —
        everything else on your card is generated from your answers.
      </p>

      <GlassCard className="w-full text-left flex flex-col gap-4">
        <div>
          <label className="text-xs text-[var(--text-muted)] mb-2 block">
            Nickname
          </label>
          <input
            autoFocus
            value={nickname}
            onChange={(e) => {
              setNickname(e.target.value);
              setError("");
            }}
            placeholder="e.g. quietstorm42"
            className="w-full bg-white/[0.04] border border-white/10 focus:border-[var(--gold)]/50 rounded-xl px-4 py-3 outline-none text-sm"
          />
        </div>

        <div>
          <label className="text-xs text-[var(--text-muted)] mb-2 block">
            Age
          </label>
          <input
            value={age}
            onChange={(e) => {
              setAgeValue(e.target.value.replace(/\D/g, ""));
              setError("");
            }}
            inputMode="numeric"
            maxLength={3}
            placeholder="18+"
            className="w-full bg-white/[0.04] border border-white/10 focus:border-[var(--gold)]/50 rounded-xl px-4 py-3 outline-none text-sm"
          />
        </div>

        <div>
          <label className="text-xs text-[var(--text-muted)] mb-2 block">
            Zodiac sign
          </label>
          <div className="grid grid-cols-4 gap-2">
            {ZODIACS.map((z) => {
              const isSelected = zodiac === z.name;
              return (
                <button
                  key={z.name}
                  onClick={() => {
                    setZodiacValue(z.name);
                    setError("");
                  }}
                  className={
                    "focus-ring flex flex-col items-center gap-1 rounded-xl py-2.5 text-[11px] transition-all " +
                    (isSelected
                      ? "bg-[var(--gold)]/15 border border-[var(--gold)]/60 text-[var(--gold)]"
                      : "glass hover:bg-white/[0.08]")
                  }
                >
                  <span className="text-base leading-none">{z.symbol}</span>
                  {z.name}
                </button>
              );
            })}
          </div>
        </div>

        {error && <p className="text-xs text-[var(--danger)]">{error}</p>}
        <Button onClick={handleContinue} className="w-full">
          Continue
        </Button>
      </GlassCard>
    </Shell>
  );
}
