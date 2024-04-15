"use client"
import { useUser } from "#/context/UserContext";
import { JoinPhase } from "./Phase/JoinPhase";
import { UserPhase } from "./Phase/UserPhase";

export const UserView = () => {
  const { user } = useUser();

  if (!user) {
    return <JoinPhase />;
  }

  return <UserPhase />;
}