"use client";

import { ReactNode, ButtonHTMLAttributes } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";

export function Shell({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <main
      className={clsx(
        "min-h-dvh w-full bg-glow flex flex-col items-center px-6 py-10",
        className
      )}
    >
      <div className="w-full max-w-md mx-auto flex flex-col flex-1">{children}</div>
    </main>
  );
}

export function GlassCard({
  children,
  className,
  as: Component = motion.div,
}: {
  children: ReactNode;
  className?: string;
  as?: typeof motion.div;
}) {
  const Comp = Component;
  return (
    <Comp
      className={clsx("glass rounded-3xl p-6", className)}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {children}
    </Comp>
  );
}

type BtnProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
};

export function Button({ children, className, variant = "primary", ...props }: BtnProps) {
  const base =
    "focus-ring inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-medium transition-all active:scale-[0.97]";
  const styles: Record<string, string> = {
    primary:
      "text-white shadow-[0_0_24px_rgba(139,107,255,0.35)] bg-gradient-to-br from-[var(--purple)] to-[var(--blue)] hover:brightness-110",
    secondary: "glass text-[var(--text)] hover:bg-white/[0.08]",
    ghost: "text-[var(--text-muted)] hover:text-[var(--text)]",
    danger: "bg-[var(--danger)]/15 text-[var(--danger)] border border-[var(--danger)]/30 hover:bg-[var(--danger)]/25",
  };
  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      className={clsx(base, styles[variant], className)}
      {...(props as any)}
    >
      {children}
    </motion.button>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="uppercase tracking-[0.2em] text-xs font-medium text-[var(--text-muted)] mb-2">
      {children}
    </p>
  );
}
