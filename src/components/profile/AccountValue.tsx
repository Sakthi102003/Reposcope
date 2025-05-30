import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'

interface AccountValueProps {
  followers: number
  following: number
  publicRepos: number
  totalStars: number
  totalForks: number
  totalViews: number
}

export function AccountValue({
  followers,
  following,
  publicRepos,
  totalStars,
  totalForks,
  totalViews,
}: AccountValueProps) {
  // Calculate account value based on various metrics
  const calculateAccountValue = () => {
    // Base value for having a GitHub account
    let value = 100

    // Value from followers (each follower adds value)
    value += followers * 50

    // Value from repositories (each repo adds base value)
    value += publicRepos * 200

    // Value from stars (each star adds significant value)
    value += totalStars * 100

    // Value from forks (each fork indicates project value)
    value += totalForks * 75

    // Value from profile views (if available)
    value += totalViews * 0.1

    // Engagement bonus (ratio of followers to following)
    const engagementRatio = following > 0 ? followers / following : followers
    value += engagementRatio * 100

    // Repository quality bonus (stars per repo)
    const starsPerRepo = publicRepos > 0 ? totalStars / publicRepos : 0
    value += starsPerRepo * 500

    return Math.round(value)
  }

  const accountValue = calculateAccountValue()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Value</CardTitle>
        <CardDescription>
          Estimated value based on your GitHub activity and influence
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold">{formatCurrency(accountValue)}</span>
            <div className="text-sm text-muted-foreground">
              Based on {followers} followers, {publicRepos} repos, and {totalStars} stars
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm font-medium">Follower Value</div>
              <div className="text-2xl font-bold">
                {formatCurrency(followers * 50)}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium">Repository Value</div>
              <div className="text-2xl font-bold">
                {formatCurrency(publicRepos * 200)}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium">Star Value</div>
              <div className="text-2xl font-bold">
                {formatCurrency(totalStars * 100)}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium">Fork Value</div>
              <div className="text-2xl font-bold">
                {formatCurrency(totalForks * 75)}
              </div>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            * This is an estimated value based on public GitHub metrics and engagement
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 