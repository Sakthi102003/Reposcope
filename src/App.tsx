import { ThemeProvider } from '@/components/theme/theme-provider'
import { ThemeToggle } from '@/components/theme/theme-toggle'
import { ParticleBackground } from '@/components/ui/particle-background'
import { Toaster } from '@/components/ui/toaster'
import Compare from '@/pages/Compare'
import Home from '@/pages/Home'
import NotFound from '@/pages/NotFound'
import Profile from '@/pages/Profile'
import { Link, Route, Routes } from 'react-router-dom'

export default function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="reposcope-theme">
      <div className="min-h-screen bg-background">
        <ParticleBackground />
        <header className="sticky top-0 z-50 w-full border-b bg-gradient-to-r from-background/95 via-background/90 to-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center justify-between">
            <div className="flex-1" />
            <div className="flex items-center justify-center flex-1">
              <Link to="/" className="flex items-center group">
                <h1 className="text-2xl md:text-3xl font-semibold tracking-tight transition-all duration-300 group-hover:scale-105 group-hover:text-primary">
                  Reposcope
                </h1>
              </Link>
            </div>
            <div className="flex-1 flex justify-end items-center gap-4">
              <Link
                to="/compare"
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                Compare Profiles
              </Link>
              <ThemeToggle />
            </div>
          </div>
        </header>
        <main className="container py-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profile/:username" element={<Profile />} />
            <Route path="/compare" element={<Compare />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
      <Toaster />
    </ThemeProvider>
  )
} 