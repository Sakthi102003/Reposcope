import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react"

interface ContributionDay {
  date: string
  contributionCount: number
}

interface ContributionWeek {
  contributionDays: ContributionDay[]
}

interface ContributionData {
  totalContributions: number
  weeks: ContributionWeek[]
  yearlyStats: {
    year: number
    total: number
    months: {
      month: number
      total: number
      name: string
    }[]
  }
}

interface ContributionHeatmapProps {
  username: string
}

export function ContributionHeatmap({ username }: ContributionHeatmapProps) {
  const [contributionData, setContributionData] = useState<ContributionData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchContributionData = async () => {
      try {
        const response = await fetch('https://api.github.com/graphql', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_GITHUB_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: `
              query($username: String!) {
                user(login: $username) {
                  contributionsCollection {
                    contributionCalendar {
                      totalContributions
                      weeks {
                        contributionDays {
                          date
                          contributionCount
                        }
                      }
                    }
                  }
                }
              }
            `,
            variables: {
              username: username
            }
          })
        })

        if (!response.ok) {
          throw new Error('Failed to fetch contribution data')
        }

        const data = await response.json()
        
        if (data.errors) {
          throw new Error(data.errors[0].message)
        }

        const contributionCalendar = data.data.user.contributionsCollection.contributionCalendar
        const weeks = contributionCalendar.weeks
        const totalContributions = contributionCalendar.totalContributions

        // Calculate monthly stats
        const monthlyStats = new Map<number, number>()
        const monthNames = [
          'January', 'February', 'March', 'April', 'May', 'June',
          'July', 'August', 'September', 'October', 'November', 'December'
        ]

        weeks.forEach((week: any) => {
          week.contributionDays.forEach((day: any) => {
            const date = new Date(day.date)
            const month = date.getMonth()
            monthlyStats.set(month, (monthlyStats.get(month) || 0) + day.contributionCount)
          })
        })

        // Format monthly stats
        const monthlyData = Array.from(monthlyStats.entries()).map(([month, total]) => ({
          month,
          total,
          name: monthNames[month]
        }))

        setContributionData({
          totalContributions,
          weeks,
          yearlyStats: {
            year: new Date().getFullYear(),
            total: totalContributions,
            months: monthlyData
          }
        })
      } catch (err) {
        console.error('Error fetching contribution data:', err)
        setError('Failed to load contribution data')
      } finally {
        setLoading(false)
      }
    }

    fetchContributionData()
  }, [username])

  const getContributionColor = (count: number): string => {
    if (count === 0) return 'bg-[#ebedf0]'
    if (count <= 3) return 'bg-[#9be9a8]'
    if (count <= 6) return 'bg-[#40c463]'
    if (count <= 9) return 'bg-[#30a14e]'
    return 'bg-[#216e39]'
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Contribution Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[100px] flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error || !contributionData || !contributionData.weeks) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Contribution Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground">
            {error || 'No contribution data available'}
          </div>
        </CardContent>
      </Card>
    )
  }

  const { weeks, totalContributions, yearlyStats } = contributionData

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contribution Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-6">
          {/* Yearly and Monthly Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-muted rounded-lg">
              <h3 className="text-sm font-medium mb-2">Yearly Overview</h3>
              <div className="text-2xl font-bold">{yearlyStats.total}</div>
              <div className="text-sm text-muted-foreground">contributions in {yearlyStats.year}</div>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <h3 className="text-sm font-medium mb-2">Monthly Breakdown</h3>
              <div className="grid grid-cols-2 gap-2">
                {yearlyStats.months.map(({ month, total, name }) => (
                  <div key={month} className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">{name}</span>
                    <span className="font-medium">{total}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Heatmap */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center text-sm text-muted-foreground">
              <span>{totalContributions} contributions in the last year</span>
              <div className="flex items-center gap-2">
                <span>Less</span>
                <div className="flex gap-1">
                  <div className="w-3 h-3 bg-[#ebedf0]"></div>
                  <div className="w-3 h-3 bg-[#9be9a8]"></div>
                  <div className="w-3 h-3 bg-[#40c463]"></div>
                  <div className="w-3 h-3 bg-[#30a14e]"></div>
                  <div className="w-3 h-3 bg-[#216e39]"></div>
                </div>
                <span>More</span>
              </div>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-1">
                  {week.contributionDays?.map((day, dayIndex) => (
                    <div
                      key={dayIndex}
                      className={`w-3 h-3 rounded-sm ${getContributionColor(day.contributionCount)}`}
                      title={`${day.date}: ${day.contributionCount} contributions`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 