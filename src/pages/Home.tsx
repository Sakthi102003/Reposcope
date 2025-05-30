import { Github } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Home() {
  const [username, setUsername] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (username.trim()) {
      navigate(`/profile/${username.trim()}`)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-16rem)]">
      <div className="text-center space-y-6 max-w-2xl">
        <div className="flex items-center justify-center">
          <Github className="h-16 w-16 text-primary" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight">
          Reposcope
        </h1>
        <p className="text-xl text-muted-foreground">
          Get deep insights into any GitHub profile. Analyze contributions, tech stack,
          and get personalized recommendations.
        </p>
        <form onSubmit={handleSubmit} className="flex gap-2 max-w-md mx-auto">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter GitHub username"
            className="flex-1 px-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Analyze
          </button>
        </form>
        <div className="mt-4">
          <Link
            to="/compare"
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            Compare two GitHub profiles →
          </Link>
        </div>
      </div>
    </div>
  )
} 