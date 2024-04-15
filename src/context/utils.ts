"use client"
import Pusher from "pusher-js";

export const createClientPusher = () => {
  Pusher.logToConsole = true;
  return new Pusher(
    "6f79353d379a22a90802",
    {
      cluster: "us2",
      // forceTLS: true,
    }
  );
}