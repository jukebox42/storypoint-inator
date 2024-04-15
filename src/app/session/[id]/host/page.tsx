"use client"
import { SessionProvider } from "#/context/SessionContext";
import { HostView } from "#/ui/HostView";

export default function Page({ params: { id }}: { params: { id: string} }) {
  return (
    <SessionProvider sessionId={id}>
      <HostView />
    </SessionProvider>
  );
}