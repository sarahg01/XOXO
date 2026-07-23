"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Shell, GlassCard, Button, Eyebrow } from "@/components/ui";
import { useSession } from "@/store/useSession";

export default function UsernamePage() {
  const router = useRouter();
  const otpVerified = useSession((s) => s.otpVerified);
  const setUsername = useSession((s) => s.setUsername);
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!otpVerified) router.replace("/login");
  }, [otpVerified, router]);

  const handleContinue = () => {
    const trimmed = value.trim();
    if (trimmed.length < 3) {
      setError("At least 3 characters.");
      return;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(trimmed)) {
      setError("Letters, numbers, and underscores only.");
      return;
    }
    setUsername(trimmed);
    router.push("/questionnaire");
  };

  return (
    <Shell className="items-center justify-center text-center">
      <Eyebrow>Step 3 of 5</Eyebrow>
      <h1 className="font-display text-2xl mb-2">Pick a username</h1>
      <p className="text-sm text-[var(--text-muted)] mb-8 max-w-xs">
        This stays private. Strangers only ever see your generated profile.
      </p>

      <GlassCard className="w-full text-left">
        <input
          autoFocus
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setError("");
          }}
          onKeyDown={(e) => e.key === "Enter" && handleContinue()}
          placeholder="e.g. quietstorm42"
          className="w-full bg-white/[0.04] border border-white/10 focus:border-[var(--emerald)]/50 rounded-xl px-4 py-3 outline-none text-sm"
        />
        {error && <p className="text-xs text-[var(--danger)] mt-2">{error}</p>}
        <Button onClick={handleContinue} className="w-full mt-5">
          Continue
        </Button>
      </GlassCard>
    </Shell>
  );
}
