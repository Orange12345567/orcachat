import { clsx } from "clsx";

export type Message = {
  id: string;
  userId: string;
  name: string;
  content: string;
  fontFamily: string;
  color: string; // text color for others; ignored for me
  ts: number;
  isSelf?: boolean;
  meBubble?: string; // my bubble color
};

export default function MessageBubble({ m, onDelete }: { m: Message, onDelete?: (id:string)=>void }) {
  const me = m.isSelf;
  const bubbleColor = (m as any).bubble || (m as any).meBubble || "#e5e7eb";
  const style: React.CSSProperties = me
    ? { ['--bubble-me' as any]: m.meBubble || "#0b93f6", fontFamily: m.fontFamily }
    : { fontFamily: m.fontFamily, color: m.color };
  return (
    <div className={clsx("flex w-full", me ? "justify-end" : "justify-start")}>
      <div
        className={clsx(
          "group relative max-w-[80%] rounded-2xl px-3 py-2 text-sm bubble",
          me ? "bubble me" : "bg-smsLight text-gray-900 bubble them"
        )}
        style={me ? { ...style, background: `var(--bubble-me)`, color: m.color } : style}
      >
        <div className="mb-1 text-[11px] opacity-80 font-semibold flex items-center justify-between"><span>{m.name}</span>{m.isSelf && onDelete && (<button onClick={()=>onDelete(m.id)} className="opacity-0 group-hover:opacity-100 transition text-[10px] px-1 py-0.5 rounded border dark:border-neutral-700">Delete</button>)}</div>
        <div className="whitespace-pre-wrap break-words">
          {m.content}
        </div>
      </div>
    </div>
  );
}
