export interface Comment {
  userId: string;
  username: string;
  message: string;
  timestamp: number;
}

export interface VoteMap {
  [userId: string]: {
    vote: 'yes' | 'no';
    timestamp: number;
  };
}

