import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Lightbulb, Star, TrendingUp, Users } from "lucide-react"

export interface Recommendation {
  type: "profile" | "activity" | "collaboration" | "visibility"
  title: string
  description: string
  impact: "high" | "medium" | "low"
}

interface RecommendationsProps {
  recommendations: Recommendation[]
}

export function Recommendations({ recommendations }: RecommendationsProps) {
  const getRecommendationIcon = (type: Recommendation["type"]) => {
    switch (type) {
      case "profile":
        return <Lightbulb className="h-4 w-4" />
      case "activity":
        return <TrendingUp className="h-4 w-4" />
      case "collaboration":
        return <Users className="h-4 w-4" />
      case "visibility":
        return <Star className="h-4 w-4" />
    }
  }

  const getImpactColor = (impact: Recommendation["impact"]) => {
    switch (impact) {
      case "high":
        return "text-red-500"
      case "medium":
        return "text-yellow-500"
      case "low":
        return "text-green-500"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recommendations</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recommendations.map((recommendation, index) => (
            <div
              key={index}
              className="flex items-start space-x-4 rounded-lg border p-4"
            >
              <div className="mt-1">
                {getRecommendationIcon(recommendation.type)}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">{recommendation.title}</h4>
                  <span
                    className={`text-xs font-medium ${getImpactColor(
                      recommendation.impact
                    )}`}
                  >
                    {recommendation.impact.toUpperCase()} IMPACT
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {recommendation.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 