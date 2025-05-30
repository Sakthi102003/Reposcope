import { AccountValue } from '@/components/profile/AccountValue'
import { ActivityTimeline } from '@/components/profile/ActivityTimeline'
import { ContributionHeatmap } from '@/components/profile/ContributionHeatmap'
import type { Recommendation } from '@/components/profile/Recommendations'
import { Recommendations } from '@/components/profile/Recommendations'
import { TechStack } from '@/components/profile/TechStack'
import { SingleUserPDFReport } from '@/components/SingleUserPDFReport'
import type { GitHubUser } from '@/lib/github'
import { Octokit } from 'octokit'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

// Define tech stack patterns with proper types
const techPatterns = {
  frameworks: {
    'React': ['react', 'react-dom', 'react-scripts', 'next', 'gatsby', 'remix', '@remix-run'],
    'Next.js': ['next', '@next'],
    'Express': ['express', 'express-'],
    'Angular': ['@angular/core', '@angular/common', '@angular/platform-browser', '@angular/compiler'],
    'Vue': ['vue', 'vue-router', 'vuex', 'nuxt', '@vue'],
    'Django': ['django', 'djangorestframework', 'django-cors-headers'],
    'Flask': ['flask', 'flask-restful', 'flask-sqlalchemy'],
    'Spring': ['spring-boot', 'spring-core', 'spring-web', 'spring-data'],
    'Laravel': ['laravel', '@laravel'],
    'Rails': ['rails', '@rails'],
    'Node.js': ['node', 'nodemon'],
    'FastAPI': ['fastapi', 'uvicorn'],
    'NestJS': ['@nestjs'],
    'Svelte': ['svelte', 'sveltekit'],
    'Ember': ['ember', '@ember'],
    'Meteor': ['meteor'],
    'Phoenix': ['phoenix'],
    'ASP.NET': ['@aspnet', '@microsoft/aspnetcore'],
  } as Record<string, string[]>,
  databases: {
    'MongoDB': ['mongodb', 'mongoose', 'mongodb-core', '@mongodb'],
    'PostgreSQL': ['pg', 'postgres', 'postgresql', 'sequelize', 'typeorm', 'prisma'],
    'MySQL': ['mysql', 'mysql2', 'sequelize', 'typeorm', 'prisma'],
    'Redis': ['redis', 'ioredis', 'redis-client'],
    'SQLite': ['sqlite3', 'better-sqlite3', 'sequelize', 'typeorm'],
    'Oracle': ['oracledb', 'oracle'],
    'Firebase': ['firebase', '@firebase', 'firebase-admin'],
    'Cassandra': ['cassandra-driver', 'cassandra'],
    'Elasticsearch': ['elasticsearch', '@elastic/elasticsearch'],
    'DynamoDB': ['dynamodb', '@aws-sdk/client-dynamodb'],
    'Neo4j': ['neo4j', 'neo4j-driver'],
    'MariaDB': ['mariadb', 'mariadb-connector'],
    'CouchDB': ['couchdb', 'nano'],
    'InfluxDB': ['influxdb', '@influxdata/influxdb-client'],
  } as Record<string, string[]>,
  tools: {
    'Git': ['git', 'simple-git', 'git-clone'],
    'Docker': ['docker', 'docker-compose', '@docker'],
    'VS Code': ['vscode', '@vscode'],
    'AWS': ['aws-sdk', '@aws-sdk', 'aws-lambda', 'aws-cdk'],
    'Azure': ['@azure', 'azure-functions', 'azure-storage'],
    'GCP': ['@google-cloud', 'google-cloud-storage', 'firebase-admin'],
    'Kubernetes': ['kubernetes', '@kubernetes/client-node'],
    'Jenkins': ['jenkins', 'jenkins-api'],
    'Nginx': ['nginx', 'nginx-conf'],
    'Apache': ['apache', 'apache2'],
    'Linux': ['linux', 'node-linux'],
    'Windows': ['windows', 'node-windows'],
    'MacOS': ['macos', 'node-macos'],
    'Terraform': ['terraform', '@terraform'],
    'Ansible': ['ansible', 'node-ansible'],
    'Puppet': ['puppet', 'node-puppet'],
    'Chef': ['chef', 'node-chef'],
    'CircleCI': ['circleci', '@circleci'],
    'Travis CI': ['travis-ci', '@travis-ci'],
    'GitHub Actions': ['@actions/core', '@actions/github'],
    'Webpack': ['webpack', 'webpack-cli', 'webpack-dev-server'],
    'Babel': ['@babel/core', '@babel/preset-env', '@babel/preset-react'],
    'TypeScript': ['typescript', '@types', 'ts-node'],
    'ESLint': ['eslint', '@eslint'],
    'Prettier': ['prettier', '@prettier'],
    'Jest': ['jest', '@jest'],
    'Mocha': ['mocha', '@mocha'],
    'Cypress': ['cypress', '@cypress'],
    'Selenium': ['selenium-webdriver', '@selenium'],
    'Postman': ['postman', '@postman'],
    'Swagger': ['swagger', '@swagger'],
    'GraphQL': ['graphql', '@apollo/client', 'apollo-server'],
  } as Record<string, string[]>,
}

interface GitHubAPIUser {
  login: string
  name: string | null
  avatar_url: string
  bio: string | null
  public_repos: number
  followers: number
  following: number
  created_at: string
  detailedTechStack: {
    frameworks: string[]
    databases: string[]
    tools: string[]
  }
}

interface Repository {
  name: string
  stargazers_count: number
  forks_count: number
  language: string | null
  description: string | null
  updated_at: string
}

// Helper function to get language colors
function getLanguageColor(language: string): string {
  const colors: Record<string, string> = {
    JavaScript: '#f7df1e',
    TypeScript: '#3178c6',
    Python: '#3776ab',
    Java: '#007396',
    C: '#555555',
    'C++': '#f34b7d',
    Ruby: '#cc342d',
    Go: '#00add8',
    Rust: '#dea584',
    PHP: '#777bb4',
    Swift: '#ffac45',
    Kotlin: '#f18e33',
    HTML: '#e34c26',
    CSS: '#563d7c',
    Shell: '#89e051',
    'C#': '#178600',
    Scala: '#c22d40',
    R: '#198ce7',
    MATLAB: '#e16737',
    'Objective-C': '#438eff',
  }
  return colors[language] || '#000000'
}

export default function Profile() {
  const { username } = useParams()
  const [user, setUser] = useState<GitHubAPIUser | null>(null)
  const [repos, setRepos] = useState<Repository[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [techStack, setTechStack] = useState<{
    frameworks: Set<string>;
    databases: Set<string>;
    tools: Set<string>;
  }>({
    frameworks: new Set<string>(),
    databases: new Set<string>(),
    tools: new Set<string>()
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Create a new Octokit instance with minimal configuration
        const octokit = new Octokit({
          auth: import.meta.env.VITE_GITHUB_TOKEN
        })
        
        // Fetch user data
        const { data: userData } = await octokit.request('GET /users/{username}', {
          username: username!,
        })

        // Fetch all repositories with pagination
        let allRepos: Repository[] = []
        let page = 1
        const perPage = 100 // Maximum allowed by GitHub API

        while (true) {
          const { data: reposData } = await octokit.request('GET /users/{username}/repos', {
            username: username!,
            sort: 'updated',
            per_page: perPage,
            page: page,
          })

          if (!reposData || reposData.length === 0) break

          allRepos = [...allRepos, ...(reposData as Repository[])]
          
          // If we got less than perPage items, we've reached the end
          if (reposData.length < perPage) break
          
          page++
        }

        // Analyze tech stack from repositories
        const newTechStack = {
          frameworks: new Set<string>(),
          databases: new Set<string>(),
          tools: new Set<string>()
        }

        // Only analyze top 5 most recently updated repositories to avoid rate limits
        const reposToAnalyze = allRepos.slice(0, 5)

        // Analyze each repository
        for (const repo of reposToAnalyze) {
          try {
            // Check package.json
            const { data: packageJson } = await octokit.request('GET /repos/{owner}/{repo}/contents/package.json', {
              owner: username!,
              repo: repo.name,
            })

            if (packageJson && 'content' in packageJson) {
              const content = JSON.parse(atob(packageJson.content))
              const dependencies = {
                ...content.dependencies,
                ...content.devDependencies,
                ...content.peerDependencies,
                ...content.optionalDependencies
              }

              // Check for frameworks
              for (const [framework, patterns] of Object.entries(techPatterns.frameworks)) {
                if (patterns.some(pattern => 
                  Object.keys(dependencies).some(dep => 
                    dep.toLowerCase().includes(pattern.toLowerCase())
                  )
                )) {
                  newTechStack.frameworks.add(framework)
                }
              }

              // Check for databases
              for (const [database, patterns] of Object.entries(techPatterns.databases)) {
                if (patterns.some(pattern => 
                  Object.keys(dependencies).some(dep => 
                    dep.toLowerCase().includes(pattern.toLowerCase())
                  )
                )) {
                  newTechStack.databases.add(database)
                }
              }

              // Check for tools
              for (const [tool, patterns] of Object.entries(techPatterns.tools)) {
                if (patterns.some(pattern => 
                  Object.keys(dependencies).some(dep => 
                    dep.toLowerCase().includes(pattern.toLowerCase())
                  )
                )) {
                  newTechStack.tools.add(tool)
                }
              }
            }
          } catch (error) {
            // Skip if package.json doesn't exist or can't be parsed
            continue
          }
        }

        // Set user data with tech stack
        setUser({
          ...userData,
          detailedTechStack: {
            frameworks: Array.from(newTechStack.frameworks),
            databases: Array.from(newTechStack.databases),
            tools: Array.from(newTechStack.tools)
          }
        } as GitHubAPIUser)

        setRepos(allRepos)
        setTechStack(newTechStack)

      } catch (err: any) {
        if (err.status === 403 && err.message.includes('rate limit')) {
          setError('GitHub API rate limit exceeded. Please try again in a few minutes.')
        } else {
          setError('Failed to fetch user data')
        }
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    if (username) {
      fetchData()
    }
  }, [username])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-16rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-16rem)]">
        <h1 className="text-2xl font-bold text-destructive mb-4">
          {error || 'User not found'}
        </h1>
      </div>
    )
  }

  // Calculate total stars and forks
  const totalStars = repos.reduce((acc, repo) => acc + repo.stargazers_count, 0)
  const totalForks = repos.reduce((acc, repo) => acc + repo.forks_count, 0)

  // Calculate language statistics
  const languageStats = repos.reduce((acc, repo) => {
    if (repo.language) {
      acc[repo.language] = (acc[repo.language] || 0) + 1
    }
    return acc
  }, {} as Record<string, number>)

  const totalRepos = Object.values(languageStats).reduce((a, b) => a + b, 0)
  const languages = Object.entries(languageStats).map(([name, count]) => ({
    name,
    percentage: Math.round((count / totalRepos) * 100),
    color: getLanguageColor(name),
  }))

  // Generate activity timeline
  const activities = repos.slice(0, 5).map(repo => ({
    type: 'commit' as const,
    title: `Updated ${repo.name}`,
    description: repo.description || 'No description available',
    date: new Date(repo.updated_at).toLocaleDateString(),
    repository: repo.name,
    repositoryUrl: `https://github.com/${username}/${repo.name}`,
  }))

  // Generate personalized recommendations based on profile data
  const generateRecommendations = (user: any, repos: any[], languages: any[], techStack: any) => {
    const recommendations: Recommendation[] = [];

    // Profile completeness check
    if (!user.bio) {
      recommendations.push({
        type: 'profile',
        title: 'Add a Bio',
        description: 'Your profile lacks a bio. Adding a bio helps others understand your expertise and interests.',
        impact: 'high',
      });
    }

    if (!user.blog && !user.twitter_username) {
      recommendations.push({
        type: 'profile',
        title: 'Add Social Links',
        description: 'Consider adding your website or social media links to increase your professional visibility.',
        impact: 'medium',
      });
    }

    // Repository activity analysis
    const recentRepos = repos.filter(repo => {
      const lastUpdate = new Date(repo.updated_at);
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
      return lastUpdate > threeMonthsAgo;
    });

    if (recentRepos.length < 2) {
      recommendations.push({
        type: 'activity',
        title: 'Increase Repository Activity',
        description: 'Your repositories haven\'t been updated recently. Regular updates show active development.',
        impact: 'high',
      });
    }

    // Repository quality check
    const reposWithReadme = repos.filter(repo => repo.has_wiki || repo.has_pages);
    if (reposWithReadme.length < repos.length * 0.5) {
      recommendations.push({
        type: 'visibility',
        title: 'Improve Repository Documentation',
        description: 'Add README files and documentation to your repositories to make them more accessible.',
        impact: 'medium',
      });
    }

    // Tech stack diversity and modernization
    if (languages.length < 3) {
      recommendations.push({
        type: 'activity',
        title: 'Diversify Your Tech Stack',
        description: 'Consider exploring different programming languages to broaden your technical expertise.',
        impact: 'medium',
      });
    }

    // Framework recommendations based on tech stack
    const frameworks = Array.from(techStack.frameworks);
    const databases = Array.from(techStack.databases);
    const tools = Array.from(techStack.tools);

    if (frameworks.length === 0) {
      recommendations.push({
        type: 'activity',
        title: 'Add Modern Frameworks',
        description: 'Consider using popular frameworks like React, Next.js, or Express to enhance your projects.',
        impact: 'high',
      });
    } else if (frameworks.length < 2) {
      recommendations.push({
        type: 'activity',
        title: 'Expand Framework Knowledge',
        description: `You're currently using ${frameworks[0]}. Consider learning additional frameworks to increase your versatility.`,
        impact: 'medium',
      });
    }

    // Database recommendations
    if (databases.length === 0) {
      recommendations.push({
        type: 'activity',
        title: 'Add Database Experience',
        description: 'Consider adding database technologies like MongoDB, PostgreSQL, or MySQL to your projects.',
        impact: 'high',
      });
    }

    // Tool recommendations
    if (tools.length === 0) {
      recommendations.push({
        type: 'activity',
        title: 'Adopt Development Tools',
        description: 'Consider using tools like Docker, Git, or CI/CD platforms to improve your development workflow.',
        impact: 'medium',
      });
    }

    // Collaboration check
    if (user.followers < 10) {
      recommendations.push({
        type: 'collaboration',
        title: 'Increase Your Network',
        description: 'Engage with the GitHub community by following other developers and participating in discussions.',
        impact: 'medium',
      });
    }

    // Star count analysis
    const totalStars = repos.reduce((acc, repo) => acc + repo.stargazers_count, 0);
    if (totalStars < 5) {
      recommendations.push({
        type: 'visibility',
        title: 'Improve Project Visibility',
        description: 'Work on creating more impactful projects that can attract stars and attention from the community.',
        impact: 'medium',
      });
    }

    return recommendations;
  };

  // Generate recommendations using the new function
  const recommendations = generateRecommendations(user, repos, languages, techStack);

  // Transform data for PDF report
  const pdfData: GitHubUser & { recommendations: Recommendation[] } = {
    username: user.login,
    contributions: {
      commits: 0, // These would need to be fetched from GitHub API
      prs: 0,
      issues: 0,
      stars: totalStars,
    },
    techStack: languages.map(lang => lang.name),
    detailedTechStack: {
      frameworks: Array.from(techStack.frameworks),
      databases: Array.from(techStack.databases),
      tools: Array.from(techStack.tools)
    },
    repositories: repos.slice(0, 10).map(repo => ({
      name: repo.name,
      language: repo.language || 'Unknown',
      stars: repo.stargazers_count,
    })),
    recommendations: recommendations,
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <div className="bg-card rounded-lg shadow-lg p-4 sm:p-6 mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
          <img
            src={user.avatar_url}
            alt={user.login}
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full"
          />
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-xl sm:text-2xl font-bold">{user.name || user.login}</h1>
            <p className="text-muted-foreground">@{user.login}</p>
            {user.bio && <p className="mt-2 text-sm sm:text-base">{user.bio}</p>}
            <div className="flex flex-wrap justify-center sm:justify-start gap-4 mt-4">
              <div>
                <span className="font-semibold">{user.public_repos}</span>
                <span className="text-muted-foreground ml-1">Repositories</span>
              </div>
              <div>
                <span className="font-semibold">{user.followers}</span>
                <span className="text-muted-foreground ml-1">Followers</span>
              </div>
              <div>
                <span className="font-semibold">{user.following}</span>
                <span className="text-muted-foreground ml-1">Following</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:gap-8">
        <AccountValue
          followers={user.followers}
          following={user.following}
          publicRepos={user.public_repos}
          totalStars={totalStars}
          totalForks={totalForks}
          totalViews={0} // GitHub API doesn't provide profile views
        />

        <ContributionHeatmap username={user.login} />

        <TechStack
          languages={languages}
          frameworks={Array.from(techStack.frameworks)}
          databases={Array.from(techStack.databases)}
          tools={Array.from(techStack.tools)}
        />

        <ActivityTimeline activities={activities} />

        <Recommendations recommendations={recommendations} />

        <div className="flex justify-center sm:justify-start">
          <SingleUserPDFReport username={user.login} data={pdfData} />
        </div>
      </div>
    </div>
  )
}