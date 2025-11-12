"use client";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { Profile } from "@/types";
import { FONT_OPTIONS } from "@/lib/fonts";

export default function NameAndStatus({ profile, onUpdate }:{ profile: Profile, onUpdate:(p:Partial<Profile>)=>void }) {
  const [name, setName] = useState(profile.display_name);
  const [status, setStatus] = useState(profile.current_status ?? "");
  const [showBar, setShowBar] = useState(profile.show_status_bar);
  const [newStatus, setNewStatus] = useState("");
  const [font, setFont] = useState(profile.font_family);
  const [textColor, setTextColor] = useState(profile.text_color);
  const [bubbleColor, setBubbleColor] = useState(profile.bubble_color);
  const statuses = profile.statuses ?? [];

  useEffect(() => {
    setName(profile.display_name);
    setStatus(profile.current_status ?? "");
    setShowBar(profile.show_status_bar);
    setFont(profile.font_family);
    setTextColor(profile.text_color);
    setBubbleColor(profile.bubble_color);
  }, [profile]);

  return (
    <div className="p-3 border-b bg-white flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-2">
        <input
          value={name}
          onChange={(e)=>setName(e.target.value)}
          onBlur={()=>onUpdate({ display_name: name })}
          placeholder="Your display name (fonts & emojis ok)"
          className="px-3 py-2 rounded-lg border w-64"
          style={{ fontFamily: font, color: textColor }}
        />
        <label className="flex items-center gap-2">
          <span className="text-sm">Show status</span>
          <input type="checkbox" checked={showBar} onChange={e=>{ setShowBar(e.target.checked); onUpdate({ show_status_bar: e.target.checked }); }} />
        </label>
        <select
          value={font}
          onChange={(e)=>{ setFont(e.target.value); onUpdate({ font_family: e.target.value }); }}
          className="px-2 py-2 border rounded-lg"
          title="Choose a font"
        >
          {FONT_OPTIONS.map(f => (
            <option key={f} value={f}>{f}</option>
          ))}
        </select>
        <label className="text-sm">Text
          <input type="color" value={textColor} onChange={(e)=>{ setTextColor(e.target.value); onUpdate({ text_color: e.target.value }); }} className="ml-2" />
        </label>
        <label className="text-sm">Bubble
          <input type="color" value={bubbleColor} onChange={(e)=>{ setBubbleColor(e.target.value); onUpdate({ bubble_color: e.target.value }); }} className="ml-2" />
        </label>
      </div>

      {showBar && (
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={status}
            onChange={(e)=>{ setStatus(e.target.value); onUpdate({ current_status: e.target.value }); }}
            className="px-2 py-2 border rounded-lg"
          >
            <option value="">— no status —</option>
            {statuses.map((s, i)=> <option key={i} value={s}>{s}</option>)}
          </select>
          <input
            value={newStatus}
            onChange={(e)=>setNewStatus(e.target.value)}
            placeholder="Add custom status (unlimited)"
            className="px-3 py-2 rounded-lg border w-64"
            onKeyDown={(e)=>{
              if(e.key === "Enter" && newStatus.trim()){
                const updated = [...statuses, newStatus.trim()];
                onUpdate({ statuses: updated, current_status: newStatus.trim() });
                setNewStatus("");
              }
            }}
          />
        </div>
      )}
    </div>
  );
}
