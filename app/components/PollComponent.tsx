'use client'

import { useState, useEffect } from 'react'
import { pusherClient } from '@/utils/pusher'
import { VoteMap } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { ThumbsUp, ThumbsDown } from 'lucide-react'

export function PollComponent() {
  const [votes, setVotes] = useState<VoteMap>({})

  useEffect(() => {
    console.log('Setting up Pusher channel');
    const channel = pusherClient.subscribe('poll-channel')
    
    channel.bind('vote', (data: { vote: 'yes' | 'no', userId: string }) => {
      console.log('Received vote:', data);
      setVotes(prev => {
        const newVotes = {
          ...prev,
          [data.userId]: {
            vote: data.vote,
            timestamp: Date.now()
          }
        };
        console.log('Updated votes:', newVotes);
        return newVotes;
      })
    })

    return () => {
      console.log('Unsubscribing from Pusher channel');
      pusherClient.unsubscribe('poll-channel')
    }
  }, [])

  const totals = Object.values(votes).reduce(
    (acc, { vote }) => {
      acc[vote]++
      return acc
    },
    { yes: 0, no: 0 }
  )

  const totalVotes = totals.yes + totals.no
  const yesPercentage = totalVotes > 0 ? (totals.yes / totalVotes) * 100 : 0

  return (
    <Card className="w-full max-w-md bg-background/80 backdrop-blur-sm border-primary/20">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Live Poll Results</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2">
          <Progress value={yesPercentage} className="h-4" />
          <div className="flex justify-between text-sm">
            <div className="flex items-center gap-2">
              <ThumbsUp className="w-4 h-4 text-green-500" />
              <span className="font-medium">{totals.yes}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">{totals.no}</span>
              <ThumbsDown className="w-4 h-4 text-red-500" />
            </div>
          </div>
        </div>
        <div className="text-center text-sm text-muted-foreground">
          Total Votes: {totalVotes}
        </div>
      </CardContent>
    </Card>
  )
}

