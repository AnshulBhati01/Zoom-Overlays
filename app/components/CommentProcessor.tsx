'use client'

import { useEffect, useRef, useState } from 'react'
import { Comment, VoteMap } from '@/types'
import { parseVote } from '@/utils/comment-parser'
import { broadcastVote } from '@/utils/pusher'
import { useToast } from '@/components/ui/use-toast'

export function CommentProcessor() {
  const processedVotes = useRef<VoteMap>({});
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectAttempts = useRef(0);
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const connectWebSocket = () => {
      try {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
          return;
        }

        const urlParams = new URLSearchParams(window.location.search);
        const sessionId = urlParams.get('session');
        if (!sessionId) {
          console.error('No session ID provided');
          toast({
            variant: "destructive",
            title: "Connection Error",
            description: "No session ID provided. Please include a 'session' parameter in the URL.",
          });
          return;
        }
        wsRef.current = new WebSocket(`wss://socialstream.ninja/ws?session=${sessionId}`);

        wsRef.current.onopen = (event) => {
          console.log('WebSocket connected', event);
          setIsConnected(true);
          reconnectAttempts.current = 0;
          toast({
            title: "Connected to stream",
            description: "Successfully connected to the comment stream",
          });
        };

        wsRef.current.onmessage = (event) => {
          console.log('Received message:', event.data);
          try {
            const comment: Comment = JSON.parse(event.data);
            console.log('Parsed comment:', comment);
            
            if (processedVotes.current[comment.userId]) {
              console.log('User already voted:', comment.userId);
              return;
            }
            
            const vote = parseVote(comment.message);
            console.log('Parsed vote:', vote);
            if (!vote) {
              console.log('Invalid vote:', comment.message);
              return;
            }
            
            processedVotes.current[comment.userId] = {
              vote,
              timestamp: comment.timestamp
            };
            console.log('Updated processedVotes:', processedVotes.current);
            
            broadcastVote(vote, comment.userId);
            console.log('Broadcasted vote:', vote, 'for user:', comment.userId);
            
          } catch (error) {
            console.error('Error processing comment:', error);
          }
        };

        wsRef.current.onclose = (event) => {
          console.log('WebSocket closed', event);
          setIsConnected(false);
          if (reconnectAttempts.current < 5) {
            reconnectAttempts.current++;
            const timeout = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000);
            setTimeout(connectWebSocket, timeout);
          } else {
            toast({
              variant: "destructive",
              title: "Connection lost",
              description: "Failed to connect to the comment stream after multiple attempts",
            });
          }
        };

        wsRef.current.onerror = (error) => {
          console.error('WebSocket error:', error);
          toast({
            variant: "destructive",
            title: "WebSocket Error",
            description: "An error occurred with the WebSocket connection. Check the console for more details.",
          });
        };

      } catch (error) {
        console.error('Error creating WebSocket:', error);
      }
    };

    connectWebSocket();

    return () => {
      wsRef.current?.close();
    };
  }, [toast]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session');
    console.log('Current session ID:', sessionId);
  }, []);

  return (
    <div className="fixed top-4 right-4">
      <div className={`h-3 w-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
    </div>
  );
}

