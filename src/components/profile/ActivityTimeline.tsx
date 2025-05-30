import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { GitCommit } from 'lucide-react'

interface Activity {
  type: 'commit' | 'pull_request' | 'issue'
  title: string
  description: string
  date: string
  repository: string
  repositoryUrl?: string
}

interface ActivityTimelineProps {
  activities: Activity[]
}

export function ActivityTimeline({ activities }: ActivityTimelineProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest updates and contributions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative space-y-6">
          {activities.map((activity, index) => (
            <div key={index} className="relative flex gap-6">
              <div className="absolute left-3 top-0 h-full w-px bg-border" />
              <div className="relative">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <GitCommit className="h-4 w-4" />
                </div>
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium">{activity.title}</p>
                  <span className="text-sm text-muted-foreground">
                    {activity.date}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {activity.description}
                </p>
                {activity.repositoryUrl ? (
                  <a
                    href={activity.repositoryUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    {activity.repository}
                  </a>
                ) : (
                  <span className="text-sm text-muted-foreground">
                    {activity.repository}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 