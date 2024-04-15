"use client"
import { UserProvider } from "#/context/UserContext";
import { UserView } from "#/ui/UserView";

export default function Page({ params: { id }}: { params: { id: string} }) {
  return (
    <UserProvider sessionId={id}>
      <UserView />
    </UserProvider>
  );
}