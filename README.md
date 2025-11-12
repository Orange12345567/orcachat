# SMS-Style Group Chat — OPTIMISTIC + RETRY BUILD (v1.0.4)

Fixes:
- **Optimistic messages:** your text shows instantly on your tab.
- **Outbox queue:** messages typed before subscribe are saved and sent once connected.
- **Auto-reconnect:** if subscribe stalls, it retries.
- **Local persistence:** name, font, color, status, custom statuses, and device uid persist through refresh.

Still no database (temporary/live-only). Set env vars and deploy on Vercel.
