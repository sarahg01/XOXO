## ONE — core flow prototype

This is the first vertical slice of the "ONE" app: phone login → OTP → username →
questionnaire → AI-generated profile → queue → match → chat with a 30-minute /
100-message expiry → archived memory.

**What's real vs. simulated in this build:**
- OTP is simulated (demo code `123456`) — no SMS provider is wired up yet.
- There's no backend: session state lives in a Zustand store in memory, so it
  resets on refresh. Nothing is persisted to a database yet.
- The queue matches you against 4 hand-written stranger profiles with canned
  reply banks (so the chat "just works" without a second real user or an LLM
  call). Swap `pickRandomStranger`/`replyBank` in `src/lib/strangers.ts` for a
  real matching + generation backend later.
- Profile generation (`src/lib/generateProfile.ts`) is a deterministic
  rules-based generator from your questionnaire answers, not an LLM call —
  fast and free to run, but you may want to swap in a real model for richer
  bios later.

**Not yet built:** Supabase auth/DB, real-time chat between two real users,
mini-games, image/voice messages, moderation/reporting backend, daily
conversation limits, achievements/streaks. The spec's `DATABASE` section is a
good starting schema once you're ready to wire up Supabase.

**Deploy to Vercel:**
1. Push this folder to a GitHub repo (e.g. under `sarahg01`).
2. Go to vercel.com → New Project → import that repo. Vercel auto-detects
   Next.js — no config needed (`vercel.json` here just pins the framework
   explicitly).
3. No environment variables are required yet since there's no real backend
   wired up (see below). Deploy — you'll get a live `*.vercel.app` URL.

Or from the CLI, from inside this folder: `npx vercel`.

**Run it:**
```bash
npm install
npm run dev
```
Then open http://localhost:3000. Fonts currently use a system stack instead
of next/font/google (this sandbox couldn't reach Google Fonts) — swap back in
`src/app/layout.tsx` / `globals.css` if you want the exact Space Grotesk +
Inter pairing once you're running with internet access.

---

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
