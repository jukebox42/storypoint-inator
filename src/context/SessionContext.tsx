"use client"

import { hostActions } from "#/actions";
import { Actions, User, options } from "#/actions/constants";
import { useRouter } from "next/navigation";
import Pusher, { Channel } from "pusher-js";
import React, { useEffect, useMemo, useState } from "react";
import { useBeforeunload } from "react-beforeunload";

type Votes = { [key: string]: string };

export type Errors = {
  join?: string,
  vote?: string,
}

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

const SessionContext = React.createContext<ContextProps>({} as any);

type Props = {
  sessionId: string,
  children: React.ReactNode,
}

export const SessionProvider = ({ sessionId, children }: Props) => {
  const router = useRouter();
  const [isReview, setIsReview] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [votes, setVotes] = useState<Votes>({});

  const channel = useMemo(() => {
    Pusher.logToConsole = true;
    const pusher = new Pusher(
      "6f79353d379a22a90802",
      {
        cluster: "us2",
        // forceTLS: true,
      }
    );

    // bind listeners
    return pusher.subscribe(sessionId)
      .unbind()
      .bind(Actions.USER_JOIN, (newUser: User) => {
        if (users.find(u => u.name === newUser.name)) {
          return hostActions.joined(sessionId, false);
        }
        
        setUsers(prev => {
          if (prev.find(u => u.id === newUser.id)) {
            return prev;
          }
          return [...prev, newUser]
        });
        hostActions.joined(sessionId, true, newUser, users, votes, isReview);
      })
      .bind(Actions.USER_VOTE, (data: { userId: string, value: string }) => {
        if (isReview || !data.userId || !options.find(o => o === data.value)) {
          return hostActions.voted(sessionId, false);
        }
        setVotes(prev => ({ ...prev, [data.userId]: data.value }));
        hostActions.voted(sessionId, true, data.value);
      })
      .bind(Actions.USER_LEAVE, (data: { userId: string }) => {
        setUsers(prev => prev.filter(u => u.id !== data.userId));
      });
  }, []);

  // handle leaving users
  useBeforeunload(() => endSession());

  useEffect(() => {
    hostActions.sendUsers(sessionId, users);
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
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
}

export const useSession = () => {
  const context = React.useContext(SessionContext);
  if (context === undefined) {
    throw new Error("useSession must be used within a SessionProvider.");
  }
  return context;
}