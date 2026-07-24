"use client";

import { create } from "zustand";
import { DisplayProfile } from "@/lib/generateProfile";
import { Stranger } from "@/lib/strangers";

export type ChatMessage = {
  id: string;
  from: "me" | "stranger";
  text: string;
  ts: number;
};

export type Memory = {
  id: string;
  strangerName: string;
  summary: string;
  topics: string[];
  lengthMinutes: number;
  messageCount: number;
  mood: string;
  oneLine: string;
  createdAt: number;
};

const CHAT_DURATION_MS = 30 * 60 * 1000;
const CHAT_MESSAGE_LIMIT = 100;

type SessionState = {
  phone: string;
  otpVerified: boolean;
  username: string;
  age: number | null;
  zodiac: string | null;
  answers: Record<string, string>;
  profile: DisplayProfile | null;

  skippedIds: string[];
  currentStranger: Stranger | null;
  matched: boolean;

  messages: ChatMessage[];
  chatStartedAt: number | null;
  chatLocked: boolean;

  memories: Memory[];

  setPhone: (phone: string) => void;
  verifyOtp: () => void;
  setUsername: (name: string) => void;
  setAge: (age: number) => void;
  setZodiac: (zodiac: string) => void;
  setAnswer: (questionId: string, optionLabel: string) => void;
  setProfile: (profile: DisplayProfile) => void;

  skipCurrent: () => void;
  talkCurrent: () => void;
  setCurrentStranger: (stranger: Stranger | null) => void;

  sendMessage: (text: string) => void;
  receiveAutoReply: () => void;
  lockChat: (reason: "time" | "limit") => void;
  archiveMemory: () => void;
  resetChat: () => void;

  chatTimeRemainingMs: () => number;
  chatMessagesRemaining: () => number;
};

export const useSession = create<SessionState>((set, get) => ({
  phone: "",
  otpVerified: false,
  username: "",
  age: null,
  zodiac: null,
  answers: {},
  profile: null,

  skippedIds: [],
  currentStranger: null,
  matched: false,

  messages: [],
  chatStartedAt: null,
  chatLocked: false,

  memories: [],

  setPhone: (phone) => set({ phone }),
  verifyOtp: () => set({ otpVerified: true }),
  setUsername: (name) => set({ username: name }),
  setAge: (age) => set({ age }),
  setZodiac: (zodiac) => set({ zodiac }),
  setAnswer: (questionId, optionLabel) =>
    set((s) => ({ answers: { ...s.answers, [questionId]: optionLabel } })),
  setProfile: (profile) => set({ profile }),

  skipCurrent: () => {
    const { currentStranger, skippedIds } = get();
    set({
      skippedIds: currentStranger
        ? [...skippedIds, currentStranger.id]
        : skippedIds,
      currentStranger: null,
    });
  },

  talkCurrent: () => {
    // In this single-player demo, a "Talk" is always mutual -> instant match.
    set({ matched: true });
  },

  setCurrentStranger: (stranger) => set({ currentStranger: stranger }),

  sendMessage: (text) => {
    if (get().chatLocked) return;
    const msg: ChatMessage = {
      id: crypto.randomUUID(),
      from: "me",
      text,
      ts: Date.now(),
    };
    set((s) => ({ messages: [...s.messages, msg] }));

    if (!get().chatStartedAt) {
      set({ chatStartedAt: Date.now() });
    }

    if (get().messages.length >= CHAT_MESSAGE_LIMIT) {
      get().lockChat("limit");
    }
  },

  receiveAutoReply: () => {
    const stranger = get().currentStranger;
    if (get().chatLocked || !stranger) return;
    const bank = stranger.replyBank;
    const text = bank[Math.floor(Math.random() * bank.length)];
    const msg: ChatMessage = {
      id: crypto.randomUUID(),
      from: "stranger",
      text,
      ts: Date.now(),
    };
    set((s) => ({ messages: [...s.messages, msg] }));
    if (get().messages.length >= CHAT_MESSAGE_LIMIT) {
      get().lockChat("limit");
    }
  },

  lockChat: () => {
    set({ chatLocked: true });
  },

  archiveMemory: () => {
    const { messages, currentStranger, chatStartedAt } = get();
    if (!currentStranger || !messages.length) return;

    const lengthMinutes = chatStartedAt
      ? Math.max(1, Math.round((Date.now() - chatStartedAt) / 60000))
      : 1;

    const topicWords = currentStranger.favoriteTopics;
    const funnyLine = messages.find((m) =>
      /lol|lmao|haha|😂/i.test(m.text)
    );

    const mood =
      currentStranger.humorScore > 6
        ? "Lighthearted"
        : currentStranger.chaosLevel > 6
        ? "Chaotic"
        : "Reflective";

    const memory: Memory = {
      id: crypto.randomUUID(),
      strangerName: currentStranger.name,
      summary: `You talked with ${currentStranger.name} about ${topicWords
        .slice(0, 2)
        .join(" and ")} for ${lengthMinutes} minute${lengthMinutes === 1 ? "" : "s"}.`,
      topics: topicWords,
      lengthMinutes,
      messageCount: messages.length,
      mood,
      oneLine: funnyLine
        ? `You both laughed about something for ${lengthMinutes} minutes.`
        : `A ${mood.toLowerCase()} ${lengthMinutes}-minute conversation with ${currentStranger.name}.`,
      createdAt: Date.now(),
    };

    set((s) => ({ memories: [memory, ...s.memories] }));
  },

  resetChat: () =>
    set({
      messages: [],
      chatStartedAt: null,
      chatLocked: false,
      matched: false,
      currentStranger: null,
    }),

  chatTimeRemainingMs: () => {
    const { chatStartedAt } = get();
    if (!chatStartedAt) return CHAT_DURATION_MS;
    return Math.max(0, CHAT_DURATION_MS - (Date.now() - chatStartedAt));
  },
  chatMessagesRemaining: () => {
    return Math.max(0, CHAT_MESSAGE_LIMIT - get().messages.length);
  },
}));

export { CHAT_DURATION_MS, CHAT_MESSAGE_LIMIT };
