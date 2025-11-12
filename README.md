# SMS-Style Groupchat (Next.js + Supabase, Vercel)

Features:
- Global room auto-join (big groupchat), SMS bubble style
- Private rooms with join-by-code and invite links
- Real-time messages + typing indicators (Supabase Realtime Presence)
- Change display name anytime (fonts + emojis allowed)
- Choose text color & bubble color; synced to everyone
- Optional status bar next to your name (dropdown of unlimited custom statuses)
- Tons of fonts; pick any + live preview

## Quick Start
1) Create a Supabase project -> copy Project URL and anon key.
2) Add **Tables & Policies**: run the SQL in `supabase/schema.sql` inside Supabase SQL Editor.
3) On Vercel: New Project -> import this repo/zip -> add env vars:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4) Deploy. Visit the URL and chat!

## Local Dev
```bash
pnpm i # or npm i / yarn
pnpm dev # http://localhost:3000
```

## Notes
- Anonymous auth is used. Each browser session is a user.
- Invite link for rooms looks like `/?code=ABC123`. You can also enter it in the join-by-code box.
