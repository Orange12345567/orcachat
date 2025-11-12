export default function DebugBar({ connected, subscribed, lastEvent, url }: { connected: boolean; subscribed: boolean; lastEvent?: string; url?: string }) {
  return (
    <div className="fixed bottom-2 left-2 z-50 rounded bg-black/80 px-3 py-2 text-[11px] text-white">
      <div>Realtime: <b>{connected ? "connected" : "disconnected"}</b></div>
      <div>Channel: <b>{subscribed ? "subscribed" : "idle"}</b></div>
      {url && <div className="truncate max-w-[60vw]">WS: {url}</div>}
      {lastEvent && <div>Last: {lastEvent}</div>}
    </div>
  );
}
