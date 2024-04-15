"use client"

import { userActions } from "#/actions";
import { Actions, User, Votes } from "#/actions/constants";
import { useRouter } from "next/navigation";
import { Channel } from "pusher-js";
import React, { useMemo, useState } from "react";
import { useBeforeunload } from "react-beforeunload";
import { createClientPusher } from "./utils";

export type Errors = {
  join?: string,
  vote?: string,
}

type ContextProps = {
  sessionId: string;
  user?: User;
  users: User[];
  errors: Errors;
  votes: Votes;
  myVote: string;
  isReview: boolean;
  channel?: Channel;
}

const UserContext = React.createContext<ContextProps>({} as any);

type Props = {
  sessionId: string,
  children: React.ReactNode,
}

export const UserProvider = ({ sessionId, children }: Props) => {
  const router = useRouter()
  const [isReview, setIsReview] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [user, setUser] = useState<User | undefined>();
  const [users, setUsers] = useState<User[]>([]);
  const [votes, setVotes] = useState<{}>({});
  const [myVote, setMyVote] = useState<string>("");

  const hostJoined = (data: { success: boolean, user?: User, users: User[], votes: Votes, isReview: boolean }) => {
    if (!data.success || !data.user) {
      return setErrors(prev => ({...prev, join: "Failed to join" }));
    }
    setErrors(prev => ({ ...prev, join: undefined }));
    setVotes(data.votes ?? {});
    setIsReview(isReview);
    setUser(data.user);
  };

  const hostUsers = (users: User[]) => {
    setUsers(users);
  };

  const hostVoted = (data: { success: boolean, value?: string}) => {
    if (!data.success || !data.value) {
      return setErrors(prev => ({...prev, vote: "Failed to vote"}));
    }
    setErrors(prev => ({ ...prev, vote: undefined }));
    setMyVote(data.value);
  };

  const hostStopVoting = (votes: Votes) => {
    setVotes(votes);
    setIsReview(true);
  };

  const hostResetVoting = () => {
    setVotes({});
    setMyVote("");
    setIsReview(false);
  };

  const hostEndSession = () => {
    router.push("/exit");
  };

  const channel = useMemo(() => {
    // bind listeners
    return createClientPusher().subscribe(sessionId)
      .unbind()
      .bind(Actions.HOST_JOINED, hostJoined)
      .bind(Actions.HOST_USERS, hostUsers)
      .bind(Actions.HOST_VOTED, hostVoted)
      .bind(Actions.HOST_STOP_VOTING, hostStopVoting)
      .bind(Actions.HOST_RESET_VOTING, hostResetVoting)
      .bind(Actions.HOST_END_SESSION, hostEndSession);
  }, []);

  // handle leaving users
  useBeforeunload(() => {
    if(!user) {
      return;
    }
    userActions.leave(sessionId, user.id);
  });

  const value = {
    sessionId,
    user,
    users,
    errors,
    votes,
    myVote,
    isReview,
    channel,
  }

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => {
  const context = React.useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider.");
  }
  return context;
}