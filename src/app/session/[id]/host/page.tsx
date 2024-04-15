"use client"
import { HostProvider } from "#/context/HostContext";
import { HostView } from "#/ui/HostView";

export default function Page({ params: { id }}: { params: { id: string} }) {
  return (
    <HostProvider sessionId={id}>
      <HostView />
    </HostProvider>
  );
}