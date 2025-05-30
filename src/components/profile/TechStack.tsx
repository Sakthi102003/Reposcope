import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { useState } from "react"

interface Language {
  name: string
  percentage: number
  color: string
}

interface TechStackProps {
  languages: Language[]
  frameworks: string[]
  databases: string[]
  tools: string[]
}

// Tech stack icons mapping
const techIcons: Record<string, string> = {
  // Languages
  JavaScript: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
  TypeScript: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
  Python: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
  Java: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg",
  C: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg",
  "C++": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg",
  Ruby: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ruby/ruby-original.svg",
  Go: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg",
  Rust: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/rust/rust-plain.svg",
  PHP: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg",
  Swift: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/swift/swift-original.svg",
  Kotlin: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kotlin/kotlin-original.svg",
  HTML: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
  CSS: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg",
  Shell: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bash/bash-original.svg",
  "C#": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg",
  Scala: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/scala/scala-original.svg",
  R: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/r/r-original.svg",
  MATLAB: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/matlab/matlab-original.svg",
  "Objective-C": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/objectivec/objectivec-plain.svg",
}

export function TechStack({ languages }: TechStackProps) {
  const [loadedIcons, setLoadedIcons] = useState<Record<string, boolean>>({})

  const getTechIcon = (name: string) => {
    return techIcons[name] || "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg"
  }

  const handleIconLoad = (name: string) => {
    setLoadedIcons(prev => ({ ...prev, [name]: true }))
  }

  const TechItem = ({ name, icon, percentage }: { name: string; icon: string; percentage?: number }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-full transition-all duration-200 hover:bg-muted/80 hover:scale-105 cursor-default"
          >
            <div className="relative w-4 h-4">
              {!loadedIcons[name] && (
                <div className="absolute inset-0 animate-pulse bg-muted-foreground/20 rounded-sm" />
              )}
              <img
                src={icon}
                alt={name}
                className={`w-4 h-4 transition-opacity duration-200 ${loadedIcons[name] ? 'opacity-100' : 'opacity-0'}`}
                onLoad={() => handleIconLoad(name)}
              />
            </div>
            <span className="text-sm">{name}</span>
            {percentage !== undefined && (
              <span className="text-xs text-muted-foreground">({percentage}%)</span>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{name}</p>
          {percentage !== undefined && <p className="text-xs text-muted-foreground">{percentage}% of codebase</p>}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tech Stack</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Languages */}
        <div>
          <h3 className="text-sm font-medium mb-4">Languages</h3>
          <div className="space-y-4">
            {languages.map((language) => (
              <div key={language.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <TechItem
                    name={language.name}
                    icon={getTechIcon(language.name)}
                    percentage={language.percentage}
                  />
                </div>
                <Progress 
                  value={language.percentage} 
                  className="h-2 transition-all duration-200 hover:h-3" 
                  style={{ backgroundColor: language.color + '20' }} 
                />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 