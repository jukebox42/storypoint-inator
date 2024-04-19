"use client"
import { hostActions } from "#/actions";
import { Actions, User, Votes, options } from "#/actions/constants";
import { useRouter } from "next/navigation";
import { Channel } from "pusher-js";
import React, { useEffect, useMemo, useState } from "react";
import { useBeforeunload } from "react-beforeunload";
import { createClientPusher } from "./utils";

type ContextProps = {
  sessionId: string;
  users: User[];
  votes: Votes;
  isReview: boolean;

  // functions
  resetVoting: () => void;
  stopVoting: () => void;
  endSession: () => void;

  channel?: Channel;
}

const HostContext = React.createContext<ContextProps>({} as any);

type Props = {
  sessionId: string,
  children: React.ReactNode,
}

export const HostProvider = ({ sessionId, children }: Props) => {
  const router = useRouter();
  const [isReview, setIsReview] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [votes, setVotes] = useState<Votes>({});

  const userJoin = (newUser: User) => {
    if (users.find(u => u.name === newUser.name)) {
      return hostActions.joined(sessionId, { success: false, userId: newUser.id, error: "name already in use" });
    }
    
    setUsers(prev => {
      if (prev.find(u => u.id === newUser.id)) {
        return prev;
      }
      return [...prev, newUser];
    });
    hostActions.joined(sessionId, { success: true, userId: newUser.id, user: newUser, users, votes, isReview });
  };

  const userVote = (data: { userId: string, value: string }) => {
    if (isReview) {
      return hostActions.voted(sessionId, { success: false, userId: data.userId, error: "Cannot vote during reviews" });
    }
    if (!data.userId || !options.find(o => o === data.value)) {
      return hostActions.voted(sessionId, { success: false, userId: data.userId, error: "Invalid value" });
    }
    setVotes(prev => ({ ...prev, [data.userId]: data.value }));
    hostActions.voted(sessionId, { success: true, userId: data.userId, value: data.value });
  }

  const userLeave = (data: { userId: string }) => {
    setUsers(prev => prev.filter(u => u.id !== data.userId));
  }

  const channel = useMemo(() => {
    // bind listeners
    return createClientPusher().subscribe(sessionId)
      .unbind()
      .bind(Actions.USER_JOIN, userJoin)
      .bind(Actions.USER_VOTE, userVote)
      .bind(Actions.USER_LEAVE, userLeave);
  }, []);

  // handle leaving users
  useBeforeunload(() => endSession());

  useEffect(() => {
    hostActions.sendUsers(sessionId, { users });
  }, [users]);

  const resetVoting = () => {
    setVotes({});
    setIsReview(false);
    hostActions.resetVoting(sessionId);
  }

  const stopVoting = () => {
    setIsReview(true);
    hostActions.stopVoting(sessionId, votes);
  }

  const endSession = () => {
    hostActions.end(sessionId);
    router.push("/exit");
  }

  const value = {
    sessionId,
    users,
    votes,
    isReview,

    resetVoting,
    stopVoting,
    endSession,

    channel,
  }

  return (
    <HostContext.Provider value={value}>
      {children}
    </HostContext.Provider>
  );
}

export const useHost = () => {
  const context = React.useContext(HostContext);
  if (context === undefined) {
    throw new Error("useSession must be used within a HostProvider.");
  }
  return context;
}