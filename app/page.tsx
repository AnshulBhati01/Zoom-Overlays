import { CommentProcessor } from './components/CommentProcessor'
import { PollComponent } from './components/PollComponent'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-transparent">
      <CommentProcessor />
      <PollComponent />
      <div className="fixed bottom-4 left-4 right-4 text-center text-white text-sm bg-black/50 p-2 rounded">
        To use: Add ?session=YOUR_SESSION_ID to the URL, replacing YOUR_SESSION_ID with your SocialStream session ID.
      </div>
    </main>
  )
}

