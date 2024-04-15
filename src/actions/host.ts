"use server"
import Pusher from "pusher";
import { v4 as uuidv4 } from "uuid";

import { Actions, User, Votes } from ".";

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID as string,
  key: process.env.PUSHER_APP_KEY as string,
  secret: process.env.PUSHER_APP_SECRET as string,
  cluster: process.env.PUSHER_APP_CLUSTER as string,
  encrypted: true
});

export const create = async () => {
  return uuidv4();
}

export const joined = async (id: string, success: boolean, user?: User, users?: User[], votes?: Votes, isReview?: boolean) => {
  pusher.trigger(id, Actions.HOST_JOINED, { success, user, users, votes, isReview });
}

export const sendUsers = async (id: string, users: User[]) => {
  pusher.trigger(id, Actions.HOST_USERS, users);
}

export const check = async (id: string) => {
  pusher.trigger(id, Actions.HOST_CHECK, null);
}

export const voted = async (id: string, success: boolean, value?: string) => {
  pusher.trigger(id, Actions.HOST_VOTED, { success, value });
}

export const stopVoting = async (id: string, votes: Votes) => {
  pusher.trigger(id, Actions.HOST_STOP_VOTING, votes);
}

export const resetVoting = async (id: string) => {
  pusher.trigger(id, Actions.HOST_RESET_VOTING, null);
}

export const end = async (id: string) => {
  pusher.trigger(id, Actions.HOST_END_SESSION, null);
}