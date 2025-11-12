import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SMS-Style Group Chat (Live Only)",
  description: "Realtime global room with presence, typing, and custom styles.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=DM+Sans:wght@400;700&family=Rubik:wght@400;700&family=Nunito:wght@400;700&family=Poppins:wght@400;700&family=Montserrat:wght@400;700&family=Work+Sans:wght@400;700&family=Figtree:wght@400;700&family=Raleway:wght@400;700&family=Noto+Sans:wght@400;700&family=Merriweather:wght@400;700&family=JetBrains+Mono:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-gray-100 text-gray-900 dark:bg-neutral-900 dark:text-neutral-100">{children}</body>
    </html>
  );
}
