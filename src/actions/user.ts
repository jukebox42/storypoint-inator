"use server"
import Pusher from "pusher";
import { v4 as uuidv4 } from "uuid";
import { Actions, options } from ".";

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID as string,
  key: process.env.PUSHER_APP_KEY as string,
  secret: process.env.PUSHER_APP_SECRET as string,
  cluster: process.env.PUSHER_APP_CLUSTER as string,
  encrypted: true
});

export const join = async (id: string, name: string, isObserver = false) => {
  const userId = uuidv4();
  pusher.trigger(id, Actions.USER_JOIN, { id: userId, name, isObserver });
  return userId;
}

export const vote = async (id: string, userId: string, value: string) => {
  if (!options.find(o => o === value)) {
    return;
  }
  pusher.trigger(id, Actions.USER_VOTE, { userId, value });
}

export const checked = async (id: string, userId: string) => {
  pusher.trigger(id, Actions.USER_CHECKED, { userId });
}

export const leave = async (id: string, userId: string) => {
  pusher.trigger(id, Actions.USER_LEAVE, { userId });
}
