"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Send, Lock, Flag } from "lucide-react";
import { useSession, CHAT_DURATION_MS } from "@/store/useSession";
import { Button } from "@/components/ui";

function formatTime(ms: number) {
  const totalSec = Math.ceil(ms / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function ChatPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();

  const currentStranger = useSession((s) => s.currentStranger);
  const messages = useSession((s) => s.messages);
  const sendMessage = useSession((s) => s.sendMessage);
  const receiveAutoReply = useSession((s) => s.receiveAutoReply);
  const chatStartedAt = useSession((s) => s.chatStartedAt);
  const chatLocked = useSession((s) => s.chatLocked);
  const lockChat = useSession((s) => s.lockChat);
  const archiveMemory = useSession((s) => s.archiveMemory);
  const chatMessagesRemaining = useSession((s) => s.chatMessagesRemaining);

  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [remaining, setRemaining] = useState(CHAT_DURATION_MS);
  const bottomRef = useRef<HTMLDivElement>(null);
  const archivedRef = useRef(false);

  useEffect(() => {
    if (!currentStranger || currentStranger.id !== params.id) {
      router.replace("/queue");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const tick = setInterval(() => {
      if (!chatStartedAt) {
        setRemaining(CHAT_DURATION_MS);
        return;
      }
      const left = Math.max(0, CHAT_DURATION_MS - (Date.now() - chatStartedAt));
      setRemaining(left);
      if (left <= 0 && !chatLocked) {
        lockChat("time");
      }
    }, 1000);
    return () => clearInterval(tick);
  }, [chatStartedAt, chatLocked, lockChat]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  useEffect(() => {
    if (chatLocked && !archivedRef.current) {
      archivedRef.current = true;
      archiveMemory();
    }
  }, [chatLocked, archiveMemory]);

  if (!currentStranger) return null;

  const handleSend = () => {
    const text = input.trim();
    if (!text || chatLocked) return;
    sendMessage(text);
    setInput("");
    setTyping(true);
    const delay = 900 + Math.random() * 1400;
    setTimeout(() => {
      setTyping(false);
      receiveAutoReply();
    }, delay);
  };

  const messagesRemaining = chatMessagesRemaining();
  const urgent = remaining < 5 * 60 * 1000;

  return (
    <div className="min-h-dvh w-full bg-glow flex flex-col max-w-md mx-auto">
      <header className="glass sticky top-0 z-10 flex items-center gap-3 px-4 py-3 border-b border-white/5">
        <button onClick={() => router.push("/queue")} className="focus-ring rounded-full p-1">
          <ArrowLeft size={18} />
        </button>
        <div className="flex-1">
          <p className="text-sm font-medium">{currentStranger.name}</p>
          <p className="text-[11px] text-[var(--text-muted)]">
            {messagesRemaining} messages left
          </p>
        </div>
        <span
          className={
            "text-xs font-mono px-2 py-1 rounded-lg " +
            (urgent ? "text-[var(--danger)] bg-[var(--danger)]/10" : "text-[var(--text-muted)] bg-white/[0.04]")
          }
        >
          {formatTime(remaining)}
        </span>
        <button className="focus-ring rounded-full p-1 text-[var(--text-muted)]" title="Report">
          <Flag size={16} />
        </button>
      </header>

      {messages.length === 0 && (
        <div className="glass mx-4 mt-4 rounded-2xl p-4">
          <p className="text-xs text-[var(--text-muted)] mb-1">Conversation starter</p>
          <p className="text-sm">{currentStranger.conversationStarters[0]}</p>
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-2">
        <AnimatePresence initial={false}>
          {messages.map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.2 }}
              className={
                "max-w-[75%] rounded-2xl px-4 py-2.5 text-sm " +
                (m.from === "me"
                  ? "self-end bg-gradient-to-br from-[var(--purple)] to-[var(--blue)] text-white rounded-br-md"
                  : "self-start glass rounded-bl-md")
              }
            >
              {m.text}
            </motion.div>
          ))}
        </AnimatePresence>

        {typing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="self-start glass rounded-2xl rounded-bl-md px-4 py-3 flex gap-1"
          >
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-[var(--text-muted)]"
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
              />
            ))}
          </motion.div>
        )}
        <div ref={bottomRef} />
      </div>

      {chatLocked ? (
        <div className="glass m-4 rounded-2xl p-5 text-center">
          <Lock size={20} className="mx-auto mb-2 text-[var(--text-muted)]" />
          <p className="text-sm font-medium mb-1">This conversation has ended</p>
          <p className="text-xs text-[var(--text-muted)] mb-4">
            It's archived. Neither of you can message again.
          </p>
          <Button className="w-full" onClick={() => router.push("/memories")}>
            View memory
          </Button>
        </div>
      ) : (
        <div className="p-4 flex items-center gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type a message"
            className="flex-1 glass rounded-2xl px-4 py-3 text-sm outline-none focus:border-[var(--emerald)]/40"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="focus-ring rounded-2xl p-3 bg-gradient-to-br from-[var(--purple)] to-[var(--blue)] disabled:opacity-40"
          >
            <Send size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
