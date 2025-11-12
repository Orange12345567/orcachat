export default function TypingDots() {
  return (
    <span className="inline-flex items-center gap-1 text-xs text-gray-500">
      <span className="animate-pulse">typing</span>
      <span className="w-1 h-1 rounded-full bg-gray-400 animate-bounce [animation-delay:-0.2s]" />
      <span className="w-1 h-1 rounded-full bg-gray-400 animate-bounce [animation-delay:0s]" />
      <span className="w-1 h-1 rounded-full bg-gray-400 animate-bounce [animation-delay:0.2s]" />
    </span>
  );
}
