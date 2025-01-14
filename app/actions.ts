'use server'

import { pusherServer } from '@/utils/pusher';

export async function submitVote(formData: FormData) {
  const vote = formData.get('vote') as string;
  
  await pusherServer.trigger('poll-channel', 'vote', { vote });

  return { success: true };
}

