"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { getSupabase } from "@/lib/supabaseClient";
import SidebarUsers, { UserPresence } from "./SidebarUsers";
import MessageBubble, { Message } from "./MessageBubble";
import ErrorPanel from "./ErrorPanel";
import DebugBar from "./DebugBar";
import { clsx } from "clsx";

const ROOM = "room:global";
const LS_KEY = "sms_groupchat_profile_v1";

const DEFAULT_FONTS = [
  "Inter, system-ui, sans-serif",
  "Arial, Helvetica, sans-serif",
  "Georgia, serif",
  "Courier New, monospace",
  "Comic Sans MS, cursive",
  "Trebuchet MS, sans-serif",
  "Times New Roman, serif",
  "Verdana, sans-serif",
];

function uid() {
  return Math.random().toString(36).slice(2);
}

type Profile = {
  name: string;
  fontFamily: string;
  color: string;
  status: string;
  customStatuses: string[];
};

export default function Chat() {
  const [userId] = useState<string>(() => {
    // persist a per-device userId too
    const k = "sms_groupchat_uid_v1";
    const existing = typeof window !== "undefined" ? localStorage.getItem(k) : null;
    if (existing) return existing;
    const id = uid();
    if (typeof window !== "undefined") localStorage.setItem(k, id);
    return id;
  });

  // Load profile from localStorage
  const [profile, setProfile] = useState<Profile>(() => {
    if (typeof window === "undefined") {
      return { name: `Guest-${Math.floor(Math.random()*999)}`, fontFamily: DEFAULT_FONTS[0], color: "#111827", status: "", customStatuses: [] };
    }
    const raw = localStorage.getItem(LS_KEY);
    if (raw) {
      try {
        const p = JSON.parse(raw) as Profile;
        return { customStatuses: [], ...p };
      } catch {}
    }
    return { name: `Guest-${Math.floor(Math.random()*999)}`, fontFamily: DEFAULT_FONTS[0], color: "#111827", status: "", customStatuses: [] };
  });

  // sync to localStorage whenever profile changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(LS_KEY, JSON.stringify(profile));
    }
  }, [profile]);

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<UserPresence[]>([]);
  const [error, setError] = useState<string | null>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const typingRef = useRef<NodeJS.Timeout | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  const [wsConnected, setWsConnected] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [lastEvent, setLastEvent] = useState<string | undefined>(undefined);

  const supabase = useMemo(() => {
    const c = getSupabase();
    if (!c) setError("Missing Supabase environment variables.");
    return c;
  }, []);

  // Hook WebSocket events via internal fetch if available (best effort)
  useEffect(() => {
    if (!supabase) return;
    // We can't directly read ws, but we can attempt a ping by opening a channel then marking connected on subscribe.
    setWsConnected(true); // If Supabase client was constructed, assume ws is available; channel subscribe will confirm
  }, [supabase]);

  const channel = useMemo(() => {
    if (!supabase) return null;
    try {
      return supabase.channel(ROOM, { config: { broadcast: { self: true }, presence: { key: userId } } });
    } catch (e: any) {
      console.error("Channel create failed", e);
      setError(e?.message || "Failed to create realtime channel.");
      return null;
    }
  }, [supabase, userId]);

  // Auto-scroll on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Join presence + listeners
  useEffect(() => {
    if (!channel) return;
    const sub = channel
      .on("broadcast", { event: "message" }, ({ payload }) => {
        const m = payload as Message;
        setMessages((prev) => [...prev, { ...m, isSelf: m.userId === userId }]);
        setLastEvent("message");
      })
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState() as Record<string, any[]>;
        const flat: UserPresence[] = Object.values(state).flat().map((p: any) => ({
          userId: p.userId,
          name: p.name,
          fontFamily: p.fontFamily,
          color: p.color,
          status: p.status,
          typing: p.typing,
        }));
        flat.sort((a, b) => a.name.localeCompare(b.name));
        setUsers(flat);
        setLastEvent("presence:sync");
      })
      .on("presence", { event: "join" }, () => setLastEvent("presence:join"))
      .on("presence", { event: "leave" }, () => setLastEvent("presence:leave"))
      .subscribe(async (st) => {
        if (st === "SUBSCRIBED") {
          setSubscribed(true);
          await channel.track({
            userId,
            name: profile.name,
            fontFamily: profile.fontFamily,
            color: profile.color,
            status: profile.status,
            typing: false
          });
        }
      });

    return () => {
      channel.unsubscribe();
      setSubscribed(false);
    };
  }, [channel, userId, profile.name, profile.fontFamily, profile.color, profile.status]);

  // Update presence when profile fields change
  useEffect(() => {
    if (!channel || !subscribed) return;
    channel.track({
      userId,
      name: profile.name,
      fontFamily: profile.fontFamily,
      color: profile.color,
      status: profile.status,
      typing: isTyping
    });
  }, [profile.name, profile.fontFamily, profile.color, profile.status, isTyping, channel, userId, subscribed]);

  function sendMessage() {
    if (!channel || !subscribed) return;
    const text = input.trim();
    if (!text) return;
    const m: Message = {
      id: uid(),
      userId,
      name: profile.name,
      content: text,
      fontFamily: profile.fontFamily,
      color: profile.color,
      ts: Date.now(),
    };
    channel.send({ type: "broadcast", event: "message", payload: m });
    setInput("");
    setIsTyping(false);
  }

  function handleTyping(val: string) {
    setInput(val);
    if (!channel || !subscribed) return;
    if (typingRef.current) clearTimeout(typingRef.current);
    setIsTyping(true);
    typingRef.current = setTimeout(() => setIsTyping(false), 1200);
  }

  // UI handlers for profile
  const setName = (v: string) => setProfile((p) => ({ ...p, name: v }));
  const setFontFamily = (v: string) => setProfile((p) => ({ ...p, fontFamily: v }));
  const setColor = (v: string) => setProfile((p) => ({ ...p, color: v }));
  const setStatus = (v: string) => setProfile((p) => ({ ...p, status: v }));
  const addCustomStatus = (v: string) => {
    if (!v) return;
    setProfile((p) => ({ ...p, customStatuses: Array.from(new Set([...(p.customStatuses || []), v])) }));
    setStatus(v);
  };

  if (error) {
    return <ErrorPanel title="Application needs configuration" details={error} />;
  }
  if (!supabase) {
    return <div className="p-6 text-sm text-gray-600">Initializing…</div>;
  }

  return (
    <div className="relative mx-auto flex h-[100dvh] max-w-[var(--chat-max)] bg-white shadow-sm">
      <SidebarUsers users={users} meId={userId} />

      <main className="flex min-w-0 flex-1 flex-col">
        {/* Header / Controls */}
        <div className="flex flex-wrap items-center gap-2 border-b p-3">
          <input
            className="h-9 rounded-md border px-3 text-sm"
            value={profile.name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your display name"
          />

          <select
            className="h-9 rounded-md border px-2 text-sm"
            value={profile.fontFamily}
            onChange={(e) => setFontFamily(e.target.value)}
          >
            {DEFAULT_FONTS.map((f) => (
              <option key={f} value={f} style={{ fontFamily: f }}>
                {f.split(",")[0]}
              </option>
            ))}
          </select>

          <input
            type="color"
            className="h-9 w-12 cursor-pointer rounded-md border"
            value={profile.color}
            onChange={(e) => setColor(e.target.value)}
            title="Message color"
          />

          {/* Status dropdown with custom add */}
          <div className="flex items-center gap-1">
            <select
              className="h-9 rounded-md border px-2 text-sm max-w-[220px]"
              value={profile.status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="">No status</option>
              <option value="Available">Available</option>
              <option value="Busy">Busy</option>
              <option value="Be right back">Be right back</option>
              {(profile.customStatuses || []).map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const input = form.elements.namedItem("customStatus") as HTMLInputElement;
                const v = input.value.trim();
                if (v) {
                  addCustomStatus(v);
                  form.reset();
                }
              }}
              className="flex items-center gap-1"
            >
              <input
                name="customStatus"
                className="h-9 w-36 rounded-md border px-2 text-sm"
                placeholder="Add custom…"
              />
              <button className="h-9 rounded-md border bg-gray-50 px-3 text-sm">Add</button>
            </form>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 space-y-2 overflow-y-auto bg-[url('data:image/svg+xml,%3Csvg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'8\\' height=\\'8\\'%3E%3Crect width=\\'8\\' height=\\'8\\' fill=\\'%23ffffff\\'/%3E%3Cpath d=\\'M0 0h8v8H0z\\' fill=\\'none\\'/%3E%3C/svg%3E')] p-4">
          {messages.map((m) => (
            <MessageBubble key={m.id} m={m} />
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* Composer */}
        <div className="flex items-center gap-2 border-t p-3">
          <textarea
            className="min-h-[44px] w-full resize-none rounded-lg border px-3 py-2 text-sm focus:outline-none"
            placeholder={subscribed ? "Message" : "Connecting to realtime…"}
            value={input}
            onChange={(e) => handleTyping(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            style={{ fontFamily: profile.fontFamily, color: profile.color }}
            disabled={!subscribed}
          />
          <button
            onClick={sendMessage}
            className={clsx(
              "h-10 shrink-0 rounded-lg px-4 text-sm font-medium text-white",
              input.trim() && subscribed ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-300 cursor-not-allowed"
            )}
            disabled={!input.trim() || !subscribed}
          >
            Send
          </button>
        </div>
      </main>

      <DebugBar
        connected={wsConnected}
        subscribed={subscribed}
        url={process.env.NEXT_PUBLIC_SUPABASE_URL ? `${process.env.NEXT_PUBLIC_SUPABASE_URL.replace("https://","wss://")}/realtime/v1` : undefined}
        lastEvent={lastEvent}
      />
    </div>
  );
}
