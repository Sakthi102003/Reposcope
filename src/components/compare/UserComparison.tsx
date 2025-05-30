import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { useToast } from '@/components/ui/use-toast'
import { generateComparisonPDF } from '@/lib/pdf-utils'
import { Download } from 'lucide-react'
import { Octokit } from 'octokit'
import { useEffect, useRef, useState } from 'react'

interface UserData {
  login: string
  avatar_url: string
  name: string | null
  bio: string | null
  public_repos: number
  followers: number
  following: number
  html_url: string
}

interface RepoData {
  name: string
  language: string | null
  stargazers_count: number
  forks_count: number
}

interface ComparisonProps {
  user1: string
  user2: string
}

export function UserComparison({ user1, user2 }: ComparisonProps) {
  const [user1Data, setUser1Data] = useState<UserData | null>(null)
  const [user2Data, setUser2Data] = useState<UserData | null>(null)
  const [user1Repos, setUser1Repos] = useState<RepoData[]>([])
  const [user2Repos, setUser2Repos] = useState<RepoData[]>([])
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState(false)
  const comparisonRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  useEffect(() => {
    const token = import.meta.env.VITE_GITHUB_TOKEN
    if (!token) {
      toast({
        title: 'Configuration Error',
        description: 'GitHub token is not configured. Please check your .env file.',
        variant: 'destructive',
      })
      setLoading(false)
      return
    }

    const octokit = new Octokit({
      auth: token,
    })

    const fetchUserData = async (username: string) => {
      try {
        const { data: userData } = await octokit.rest.users.getByUsername({
          username,
        })
        return {
          login: userData.login,
          avatar_url: userData.avatar_url,
          name: userData.name,
          bio: userData.bio,
          public_repos: userData.public_repos,
          followers: userData.followers,
          following: userData.following,
          html_url: userData.html_url,
        }
      } catch (error: any) {
        console.error(`Error fetching user ${username}:`, error)
        const errorMessage = error.response?.status === 404 
          ? `User ${username} not found. Please check the username.`
          : `Failed to fetch data for ${username}. Please try again.`
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
        })
        return null
      }
    }

    const fetchUserRepos = async (username: string) => {
      try {
        const { data: repos } = await octokit.rest.repos.listForUser({
          username,
          sort: 'updated',
          per_page: 100,
        })
        return repos.map(repo => ({
          name: repo.name,
          language: repo.language || null,
          stargazers_count: repo.stargazers_count || 0,
          forks_count: repo.forks_count || 0,
        }))
      } catch (error) {
        console.error(`Error fetching repos for ${username}:`, error)
        toast({
          title: 'Error',
          description: `Failed to fetch repositories for ${username}.`,
          variant: 'destructive',
        })
        return []
      }
    }

    const fetchData = async () => {
      setLoading(true)
      try {
        const [user1Data, user2Data] = await Promise.all([
          fetchUserData(user1),
          fetchUserData(user2),
        ])

        if (!user1Data || !user2Data) {
          setLoading(false)
          return
        }

        const [user1Repos, user2Repos] = await Promise.all([
          fetchUserRepos(user1),
          fetchUserRepos(user2),
        ])

        setUser1Data(user1Data)
        setUser2Data(user2Data)
        setUser1Repos(user1Repos)
        setUser2Repos(user2Repos)
      } catch (error) {
        console.error('Error fetching data:', error)
        toast({
          title: 'Error',
          description: 'Failed to fetch comparison data. Please try again.',
          variant: 'destructive',
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user1, user2, toast])

  const calculateLanguageStats = (repos: RepoData[]) => {
    const languages: { [key: string]: number } = {}
    repos.forEach(repo => {
      if (repo.language) {
        languages[repo.language] = (languages[repo.language] || 0) + 1
      }
    })
    return Object.entries(languages)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
  }

  const calculateTotalStars = (repos: RepoData[]) => {
    return repos.reduce((sum, repo) => sum + repo.stargazers_count, 0)
  }

  const calculateTotalForks = (repos: RepoData[]) => {
    return repos.reduce((sum, repo) => sum + repo.forks_count, 0)
  }

  const handleDownloadPDF = async () => {
    if (!comparisonRef.current) {
      toast({
        title: 'Error',
        description: 'Comparison content not found.',
        variant: 'destructive',
      })
      return
    }

    setDownloading(true)
    try {
      const pdf = await generateComparisonPDF(comparisonRef.current, user1, user2)
      pdf.save(`github-comparison-${user1}-vs-${user2}.pdf`)
      toast({
        title: 'Success',
        description: 'PDF downloaded successfully!',
      })
    } catch (error) {
      console.error('Error generating PDF:', error)
      toast({
        title: 'Error',
        description: 'Failed to generate PDF. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setDownloading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-end">
          <Button disabled className="gap-2">
            <Download className="h-4 w-4" />
            Download PDF
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <Skeleton className="h-32 w-full" />
          </Card>
          <Card className="p-6">
            <Skeleton className="h-32 w-full" />
          </Card>
        </div>
      </div>
    )
  }

  if (!user1Data || !user2Data) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-semibold mb-2">Unable to load user data</h2>
        <p className="text-muted-foreground">Please check if the usernames are correct and try again.</p>
      </div>
    )
  }

  const user1Languages = calculateLanguageStats(user1Repos)
  const user2Languages = calculateLanguageStats(user2Repos)
  const user1Stars = calculateTotalStars(user1Repos)
  const user2Stars = calculateTotalStars(user2Repos)
  const user1Forks = calculateTotalForks(user1Repos)
  const user2Forks = calculateTotalForks(user2Repos)

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button 
          onClick={handleDownloadPDF} 
          className="gap-2"
          disabled={downloading}
        >
          <Download className="h-4 w-4" />
          {downloading ? 'Generating PDF...' : 'Download PDF'}
        </Button>
      </div>
      <div ref={comparisonRef} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* User 1 Card */}
        <Card className="p-6">
          <div className="flex items-start gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user1Data.avatar_url} alt={user1Data.login} />
              <AvatarFallback>{user1Data.login.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-2xl font-bold">{user1Data.name || user1Data.login}</h2>
              <p className="text-muted-foreground">@{user1Data.login}</p>
              <p className="mt-2">{user1Data.bio}</p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{user1Data.public_repos}</div>
              <div className="text-sm text-muted-foreground">Repositories</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{user1Data.followers}</div>
              <div className="text-sm text-muted-foreground">Followers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{user1Data.following}</div>
              <div className="text-sm text-muted-foreground">Following</div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Top Languages</h3>
            <div className="space-y-2">
              {user1Languages.map(([language, count]) => (
                <div key={language}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{language}</span>
                    <span>{count} repos</span>
                  </div>
                  <Progress value={(count / user1Repos.length) * 100} />
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold">{user1Stars}</div>
              <div className="text-sm text-muted-foreground">Total Stars</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold">{user1Forks}</div>
              <div className="text-sm text-muted-foreground">Total Forks</div>
            </div>
          </div>
        </Card>

        {/* User 2 Card */}
        <Card className="p-6">
          <div className="flex items-start gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user2Data.avatar_url} alt={user2Data.login} />
              <AvatarFallback>{user2Data.login.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-2xl font-bold">{user2Data.name || user2Data.login}</h2>
              <p className="text-muted-foreground">@{user2Data.login}</p>
              <p className="mt-2">{user2Data.bio}</p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{user2Data.public_repos}</div>
              <div className="text-sm text-muted-foreground">Repositories</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{user2Data.followers}</div>
              <div className="text-sm text-muted-foreground">Followers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{user2Data.following}</div>
              <div className="text-sm text-muted-foreground">Following</div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Top Languages</h3>
            <div className="space-y-2">
              {user2Languages.map(([language, count]) => (
                <div key={language}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{language}</span>
                    <span>{count} repos</span>
                  </div>
                  <Progress value={(count / user2Repos.length) * 100} />
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold">{user2Stars}</div>
              <div className="text-sm text-muted-foreground">Total Stars</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold">{user2Forks}</div>
              <div className="text-sm text-muted-foreground">Total Forks</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
} 