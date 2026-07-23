"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Shell, GlassCard, Button, Eyebrow } from "@/components/ui";
import { useSession } from "@/store/useSession";

const DEMO_CODE = "123456";

export default function OtpPage() {
  const router = useRouter();
  const phone = useSession((s) => s.phone);
  const verifyOtp = useSession((s) => s.verifyOtp);
  const [digits, setDigits] = useState(Array(6).fill(""));
  const [error, setError] = useState("");
  const refs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (!phone) router.replace("/login");
  }, [phone, router]);

  const handleChange = (i: number, val: string) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...digits];
    next[i] = val;
    setDigits(next);
    setError("");
    if (val && i < 5) refs.current[i + 1]?.focus();
    if (next.every((d) => d !== "") && next.join("").length === 6) {
      checkCode(next.join(""));
    }
  };

  const checkCode = (code: string) => {
    if (code === DEMO_CODE) {
      verifyOtp();
      router.push("/username");
    } else {
      setError("Incorrect code. This is a demo — try 123456.");
    }
  };

  return (
    <Shell className="items-center justify-center text-center">
      <Eyebrow>Step 2 of 5</Eyebrow>
      <h1 className="font-display text-2xl mb-2">Enter the code</h1>
      <p className="text-sm text-[var(--text-muted)] mb-1 max-w-xs">
        We sent a 6-digit code to +91 {phone}.
      </p>
      <p className="text-xs text-[var(--emerald)] mb-8">
        Demo mode — use 123456
      </p>

      <GlassCard className="w-full">
        <div className="flex justify-between gap-2 mb-4">
          {digits.map((d, i) => (
            <input
              key={i}
              ref={(el) => {
                refs.current[i] = el;
              }}
              value={d}
              onChange={(e) => handleChange(i, e.target.value)}
              inputMode="numeric"
              maxLength={1}
              className="w-10 h-12 text-center rounded-xl bg-white/[0.04] border border-white/10 focus:border-[var(--emerald)]/50 outline-none text-lg"
            />
          ))}
        </div>
        {error && <p className="text-xs text-[var(--danger)] mb-2">{error}</p>}
        <Button onClick={() => checkCode(digits.join(""))} className="w-full">
          Verify
        </Button>
      </GlassCard>
    </Shell>
  );
}
