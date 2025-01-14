import Pusher from 'pusher';
import PusherClient from 'pusher-js';
import { Comment } from '@/types';

export const pusherServer = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  useTLS: true,
});

export const pusherClient = new PusherClient(
  process.env.NEXT_PUBLIC_PUSHER_APP_KEY!,
  {
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  }
);

export async function broadcastVote(vote: 'yes' | 'no', userId: string) {
  await pusherServer.trigger('poll-channel', 'vote', { vote, userId });
}

