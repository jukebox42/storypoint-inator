"use client"
import { UserProvider } from "#/context/UserContext";
import { useUser } from "#/context/UserContext";
import { JoinPhase } from "#/ui/Phase/JoinPhase";
import { UserPhase } from "#/ui/Phase/UserPhase";

const UserView = () => {
  const { user } = useUser();

  if (!user) {
    return <JoinPhase />;
  }

  return <UserPhase />;
}

export default function Page({ params: { id }}: { params: { id: string} }) {
  return (
    <UserProvider sessionId={id}>
      <UserView />
    </UserProvider>
  );
}