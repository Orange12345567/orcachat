# Private Rooms, Synced Colors, and Extra Fonts

This update adds:
- **Private rooms by code**: Go to `/` and create a room. Share the code; only people with the code can join at `/room/<CODE>`.
- **Synced colors**: Your **text color** and **bubble color** are now visible to others on your messages (including the bubble tail).
- **Lots more fonts**: A big set of Google Fonts is now available in the font picker.

## Supabase Setup
This project uses Supabase Realtime. Make sure to set:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Deploy on Vercel
Set the two env vars above in your Vercel project settings.

## Notes
- Rooms are implemented as separate Supabase Realtime channels named `room:<CODE>`.
- Color sync uses broadcast payloads; existing messages will show the sender's bubble color for everyone.
