"use server"
import Pusher from "pusher";
import { v4 as uuidv4 } from "uuid";
import { Actions, options } from ".";

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

export const join = async (id: string, name: string, isObserver = false) => {
  const userId = uuidv4();
  const pusher = createPusher();
  pusher.trigger(id, Actions.USER_JOIN, { id: userId, name, isObserver });
  return userId;
}

export const vote = async (id: string, userId: string, value: string) => {
  if (!options.find(o => o === value)) {
    return;
  }
  const pusher = createPusher();
  pusher.trigger(id, Actions.USER_VOTE, { userId, value });
}

export const checked = async (id: string, userId: string) => {
  const pusher = createPusher();
  pusher.trigger(id, Actions.USER_CHECKED, { userId });
}

export const leave = async (id: string, userId: string) => {
  const pusher = createPusher();
  pusher.trigger(id, Actions.USER_LEAVE, { userId });
}

