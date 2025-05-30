import { Github } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <Github className="h-6 w-6" />
          <span className="font-bold text-xl">GitHub Profile Analyzer</span>
        </Link>
        
        <div className="flex items-center space-x-4">
          <Link to="/" className="text-sm font-medium hover:text-primary">
            Home
          </Link>
          <Link to="/compare" className="text-sm font-medium hover:text-primary">
            Compare
          </Link>
        </div>
      </div>
    </nav>
  )
} 