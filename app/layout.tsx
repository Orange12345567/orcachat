import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SMS Groupchat",
  description: "Real-time SMS-style group chat with private rooms (Next.js + Supabase)"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
