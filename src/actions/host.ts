"use server"
import Pusher from "pusher";
import { v4 as uuidv4 } from "uuid";

import { Actions, User, Votes } from ".";

const createPusher = () => {
  const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID as string,
    key: process.env.PUSHER_APP_KEY as string,
    secret: process.env.PUSHER_APP_SECRET as string,
    cluster: process.env.PUSHER_APP_CLUSTER as string,
    useTLS: true
  });
  return pusher;
}

export const create = () => {
  return uuidv4();
}

export const joined = (id: string, success: boolean, user?: User, users?: User[], votes?: Votes, isReview?: boolean) => {
  const pusher = createPusher();
  pusher.trigger(id, Actions.HOST_JOINED, { success, user, users, votes, isReview });
}

export const sendUsers = (id: string, users: User[]) => {
  const pusher = createPusher();
  pusher.trigger(id, Actions.HOST_USERS, users);
}

export const check = (id: string) => {
  const pusher = createPusher();
  pusher.trigger(id, Actions.HOST_CHECK, null);
}

export const voted = (id: string, success: boolean, value?: string) => {
  const pusher = createPusher();
  pusher.trigger(id, Actions.HOST_VOTED, { success, value });
}

export const stopVoting = (id: string, votes: Votes) => {
  const pusher = createPusher();
  pusher.trigger(id, Actions.HOST_STOP_VOTING, votes);
}

export const resetVoting = (id: string) => {
  const pusher = createPusher();
  pusher.trigger(id, Actions.HOST_RESET_VOTING, null);
}

export const end = (id: string) => {
  const pusher = createPusher();
  pusher.trigger(id, Actions.HOST_END_SESSION, null);
}