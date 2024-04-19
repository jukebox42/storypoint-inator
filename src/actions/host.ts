"use server"
import Pusher from "pusher";
import { v4 as uuidv4 } from "uuid";

import { Actions, Votes } from ".";
import { JoinedData, SendUsersData, VotedData } from "./types";

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

export const joined = (id: string, data: JoinedData) => {
  const pusher = createPusher();
  pusher.trigger(id, Actions.HOST_JOINED, data);
}

export const sendUsers = (id: string, { users }: SendUsersData ) => {
  const pusher = createPusher();
  pusher.trigger(id, Actions.HOST_USERS, users);
}

export const voted = (id: string, data: VotedData) => {
  const pusher = createPusher();
  pusher.trigger(id, Actions.HOST_VOTED, data);
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