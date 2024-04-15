"use client"

import { userActions } from "#/actions";
import { Actions, User } from "#/actions/constants";
import { useRouter } from "next/navigation";
import Pusher, { Channel } from "pusher-js";
import React, { useMemo, useState } from "react";
import { useBeforeunload } from "react-beforeunload";

type Votes = { [key: string]: string };

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

  // handle leaving users
  useBeforeunload(() => {
    if(!user) {
      return;
    }
    userActions.leave(sessionId, user.id);
  });

  const channel = useMemo(() => {
    Pusher.logToConsole = true;
    const pusher = new Pusher(
      "6f79353d379a22a90802",
      {
        cluster: "us2",
        // forceTLS: true,
      }
    );

    const intChannel = pusher.subscribe(sessionId);

    intChannel
      .unbind()
      .bind(Actions.HOST_JOINED, (data: { success: boolean, user?: User, users: User[], votes: Votes, isReview: boolean }) => {
        if (!data.success || !data.user) {
          return setErrors(prev => ({...prev, join: "Failed to join" }));
        }
        setErrors(prev => ({ ...prev, join: undefined }));
        setVotes(data.votes ?? {});
        setIsReview(isReview);
        setUser(data.user);
      })
      .bind(Actions.HOST_USERS, (users: User[]) => {
        setUsers(users);
      })
      .bind(Actions.HOST_VOTED, (data: { success: boolean, value?: string}) => {
        if (!data.success || !data.value) {
          return setErrors(prev => ({...prev, vote: "Failed to vote"}));
        }
        setErrors(prev => ({ ...prev, vote: undefined }));
        setMyVote(data.value);
      })
      .bind(Actions.HOST_STOP_VOTING, (votes: Votes) => {
        setVotes(votes);
        setIsReview(true);
      })
      .bind(Actions.HOST_RESET_VOTING, () => {
        setVotes({});
        setMyVote("");
        setIsReview(false);
      })
      .bind(Actions.HOST_END_SESSION, () => {
        router.push("/exit");
      });
   return intChannel;
  }, []);

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