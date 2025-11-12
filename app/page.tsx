"use client";
import Chat from "@/components/Chat";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

export const dynamic = 'force-dynamic';

function PageInner(){
  const params = useSearchParams();
  const code = params.get("code");
  const room = params.get("room");
  const initial = code ? code.toUpperCase() : (room === "global" ? "GLOBAL" : null);
  return <Chat initialRoomCode={initial} />;
}

export default function Page(){
  return (
    <Suspense fallback={null}>
      <PageInner />
    </Suspense>
  );
}
