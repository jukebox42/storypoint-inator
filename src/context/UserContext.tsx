"use client"
import { useRouter } from "next/navigation";
import { Channel } from "pusher-js";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useBeforeunload } from "react-beforeunload";

import { userActions } from "#/actions";
import { Actions, User, Votes } from "#/actions/constants";
import { createClientPusher } from "./utils";
import { JoinedData, VotedData } from "#/actions/types";

export type Errors = {
  join?: string;
  vote?: string;
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

  joinSession: (name: string) => void;
}

const UserContext = React.createContext<ContextProps>({} as any);

type Props = {
  sessionId: string;
  children: React.ReactNode;
}

export const UserProvider = ({ sessionId, children }: Props) => {
  const router = useRouter();
  const idRef = useRef(""); // using a ref because it's checked in callbacks
  const [isReview, setIsReview] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [user, setUser] = useState<User | undefined>();
  const [users, setUsers] = useState<User[]>([]);
  const [votes, setVotes] = useState<{}>({});
  const [myVote, setMyVote] = useState<string>("");

  const joinSession = async (name: string) =>
    idRef.current = await userActions.join(sessionId, name);

  const hostJoined = (data: JoinedData) => {
    if (idRef.current === "" || data.userId !== idRef.current) {
      return;
    }

    if (!data.success) {
      idRef.current = "";
      return setErrors(prev => ({...prev, join: data.error ?? "Failed to join." }));
    }

    setErrors(prev => ({ ...prev, join: undefined }));
    setVotes(data.votes);
    setIsReview(data.isReview);
    setUser(data.user);
    setUsers(data.users);
  };

  const hostUsers = (users: User[]) => {
    setUsers(users);
  };

  const hostVoted = (data: VotedData) => {
    if (data.userId !== idRef.current) {
      return;
    }
    if (!data.success) {
      return setErrors(prev => ({...prev, vote: data.error ?? "Failed to vote."}));
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

    joinSession,
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