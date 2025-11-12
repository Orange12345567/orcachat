# SMS-Style Group Chat — PERSIST + DEBUG BUILD

- **Local persistence** of name/font/color/status/custom statuses using `localStorage` (survives refresh).
- **Realtime connection bar** shows whether you're connected/subscribed and last event received.
- **Send buffer guard**: messages only send after channel is subscribed.
- Still **no database** (temporary/live-only).

## Env (Vercel)
```
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY
```

## Run
```bash
npm i
npm run dev
```
