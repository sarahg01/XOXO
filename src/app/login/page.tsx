"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Shell, GlassCard, Button, Eyebrow } from "@/components/ui";
import { useSession } from "@/store/useSession";
import { Thread } from "@/components/Thread";

export default function LoginPage() {
  const router = useRouter();
  const setPhone = useSession((s) => s.setPhone);
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  const handleContinue = () => {
    const digits = value.replace(/\D/g, "");
    if (digits.length < 10) {
      setError("Enter a valid 10-digit phone number.");
      return;
    }
    setPhone(digits);
    router.push("/otp");
  };

  return (
    <Shell className="items-center justify-center text-center">
      <Thread size={140} />
      <Eyebrow>Step 1 of 5</Eyebrow>
      <h1 className="font-display text-2xl mb-2">What's your number?</h1>
      <p className="text-sm text-[var(--text-muted)] mb-8 max-w-xs">
        We'll text you a one-time code. Your number is never shown to anyone
        on ONE.
      </p>

      <GlassCard className="w-full text-left">
        <label className="text-xs text-[var(--text-muted)] mb-2 block">
          Phone number
        </label>
        <div className="flex items-center gap-2 rounded-xl bg-white/[0.04] border border-white/10 px-4 py-3 focus-within:border-[var(--emerald)]/50">
          <span className="text-[var(--text-muted)] text-sm">+91</span>
          <input
            autoFocus
            inputMode="numeric"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setError("");
            }}
            onKeyDown={(e) => e.key === "Enter" && handleContinue()}
            placeholder="98765 43210"
            className="bg-transparent outline-none flex-1 text-sm"
          />
        </div>
        {error && <p className="text-xs text-[var(--danger)] mt-2">{error}</p>}
        <Button onClick={handleContinue} className="w-full mt-5">
          Send code
        </Button>
      </GlassCard>
    </Shell>
  );
}
