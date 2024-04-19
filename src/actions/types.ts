import { User, Votes } from ".";

type DataResponse = {
  success: boolean;
  userId: string;
};

export type JoinedData = ({
  success: false;
  error: string;
} & DataResponse) | ({
  success: true;
  user: User;
  users: User[];
  votes: Votes;
  isReview: boolean;
} & DataResponse)

export type SendUsersData = {
  users: User[];
}

export type VotedData = ({
  success: true;
  value: string;
} & DataResponse) | ({
  success: false;
  error: string;
} & DataResponse);