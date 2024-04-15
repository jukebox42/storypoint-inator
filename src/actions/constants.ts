export type User = {
  id: string,
  name: string,
  isObserver?: boolean,
}

export type Votes = { [key: string]: string };

export type Checks = { [key: string]: Date };

export enum Actions {
  HOST_CHECK = "check",
  USER_CHECKED = "here",
  USER_JOIN = "join",
  HOST_JOINED = "joined",
  HOST_USERS = "users",
  USER_VOTE = "vote",
  HOST_VOTED = "voted",
  HOST_RESET_VOTING = "reset",
  HOST_STOP_VOTING = "stop",
  HOST_END_SESSION = "end",
  USER_LEAVE = "leave",
};

export const options = ["1", "3", "5", "8", "13", "?"];
