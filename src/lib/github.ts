export interface GitHubUser {
  username: string;
  contributions: {
    commits: number;
    prs: number;
    issues: number;
    stars: number;
  };
  techStack: string[];
  detailedTechStack: TechStack;
  repositories: {
    name: string;
    language: string;
    stars: number;
  }[];
}

interface GitHubRepository {
  name: string;
  language: string | null;
  stargazers_count: number;
}

interface UserResponse {
  login: string;
}

interface TechStack {
  frameworks: string[]
  databases: string[]
  tools: string[]
}

// Common tech stack patterns
const techPatterns = {
  frameworks: {
    'React': ['react', 'react-dom', 'react-scripts'],
    'Next.js': ['next'],
    'Express': ['express'],
    'Angular': ['@angular/core', '@angular/common'],
    'Vue': ['vue', 'vue-router'],
    'Django': ['django'],
    'Flask': ['flask'],
    'Spring': ['spring-boot', 'spring-core'],
    'Laravel': ['laravel'],
    'Rails': ['rails'],
    'Node.js': ['node'],
  },
  databases: {
    'MongoDB': ['mongodb', 'mongoose'],
    'PostgreSQL': ['pg', 'postgres', 'postgresql'],
    'MySQL': ['mysql', 'mysql2'],
    'Redis': ['redis'],
    'SQLite': ['sqlite3'],
    'Oracle': ['oracledb'],
    'Firebase': ['firebase'],
  },
  tools: {
    'Git': ['git'],
    'Docker': ['docker'],
    'VS Code': ['vscode'],
    'AWS': ['aws-sdk', '@aws-sdk'],
    'Azure': ['@azure'],
    'GCP': ['@google-cloud'],
    'Kubernetes': ['kubernetes'],
    'Jenkins': ['jenkins'],
    'Nginx': ['nginx'],
    'Apache': ['apache'],
    'Linux': ['linux'],
    'Windows': ['windows'],
    'MacOS': ['macos'],
  }
}

const GITHUB_API_BASE = 'https://api.github.com';

async function fetchFromGitHub<T>(endpoint: string): Promise<T> {
  const token = import.meta.env.VITE_GITHUB_TOKEN;
  const headers: HeadersInit = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'Reposcope'
  };

  if (token) {
    headers['Authorization'] = `token ${token}`;
  }

  const response = await fetch(`${GITHUB_API_BASE}${endpoint}`, {
    headers
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('User not found');
    }
    if (response.status === 403) {
      throw new Error('Rate limit exceeded. Please try again later.');
    }
    throw new Error(`GitHub API error: ${response.statusText}`);
  }

  return response.json();
}

async function analyzeTechStack(username: string, repos: GitHubRepository[]): Promise<TechStack> {
  const techStack: TechStack = {
    frameworks: [],
    databases: [],
    tools: []
  }

  const foundTech = new Set<string>()

  for (const repo of repos) {
    try {
      // Fetch package.json for Node.js projects
      const packageJson = await fetchFromGitHub<any>(`/repos/${username}/${repo.name}/contents/package.json`)
      if (packageJson && packageJson.content) {
        const dependencies = JSON.parse(atob(packageJson.content))
        const allDeps = {
          ...dependencies.dependencies,
          ...dependencies.devDependencies
        }

        // Check for frameworks
        for (const [framework, patterns] of Object.entries(techPatterns.frameworks)) {
          if (patterns.some(pattern => Object.keys(allDeps).some(dep => dep.includes(pattern)))) {
            foundTech.add(framework)
          }
        }

        // Check for databases
        for (const [database, patterns] of Object.entries(techPatterns.databases)) {
          if (patterns.some(pattern => Object.keys(allDeps).some(dep => dep.includes(pattern)))) {
            foundTech.add(database)
          }
        }

        // Check for tools
        for (const [tool, patterns] of Object.entries(techPatterns.tools)) {
          if (patterns.some(pattern => Object.keys(allDeps).some(dep => dep.includes(pattern)))) {
            foundTech.add(tool)
          }
        }
      }

      // Check for Python requirements.txt
      const requirements = await fetchFromGitHub<any>(`/repos/${username}/${repo.name}/contents/requirements.txt`)
      if (requirements && requirements.content) {
        const deps = atob(requirements.content).split('\n')
        
        // Check for frameworks
        for (const [framework, patterns] of Object.entries(techPatterns.frameworks)) {
          if (patterns.some(pattern => deps.some(dep => dep.toLowerCase().includes(pattern.toLowerCase())))) {
            foundTech.add(framework)
          }
        }

        // Check for databases
        for (const [database, patterns] of Object.entries(techPatterns.databases)) {
          if (patterns.some(pattern => deps.some(dep => dep.toLowerCase().includes(pattern.toLowerCase())))) {
            foundTech.add(database)
          }
        }
      }
    } catch (error) {
      // Skip if we can't fetch the files
      continue
    }
  }

  // Convert found tech to arrays
  techStack.frameworks = Array.from(foundTech).filter(tech => 
    Object.keys(techPatterns.frameworks).includes(tech)
  )
  techStack.databases = Array.from(foundTech).filter(tech => 
    Object.keys(techPatterns.databases).includes(tech)
  )
  techStack.tools = Array.from(foundTech).filter(tech => 
    Object.keys(techPatterns.tools).includes(tech)
  )

  return techStack
}

export async function fetchUserData(username: string): Promise<GitHubUser> {
  if (!username || username.trim() === '') {
    throw new Error('Username cannot be empty');
  }

  try {
    console.log(`Fetching data for user: ${username}`);
    
    // Fetch user profile
    const user = await fetchFromGitHub<UserResponse>(`/users/${username}`);
    console.log(`Found user: ${user.login}`);
    
    // Fetch user repositories
    const repos = await fetchFromGitHub<GitHubRepository[]>(`/users/${username}/repos?sort=updated&per_page=100`);
    console.log(`Found ${repos.length} repositories`);

    // Calculate contributions
    const contributions = {
      commits: 0,
      prs: 0,
      issues: 0,
      stars: 0,
    };

    // Get tech stack from repositories
    const techStack = new Set<string>();
    const repositories = repos.map((repo): GitHubUser['repositories'][0] => {
      if (repo.language) {
        techStack.add(repo.language);
      }
      return {
        name: repo.name,
        language: repo.language || 'Unknown',
        stars: repo.stargazers_count || 0,
      };
    });

    // Analyze detailed tech stack
    const detailedTechStack = await analyzeTechStack(username, repos);

    // Sort repositories by stars
    repositories.sort((a, b) => b.stars - a.stars);

    // Calculate total stars
    contributions.stars = repositories.reduce((sum, repo) => sum + repo.stars, 0);
    console.log(`Total stars: ${contributions.stars}`);

    // Try to fetch contribution statistics if we have repositories
    if (repositories.length > 0) {
      try {
        console.log(`Fetching contribution stats for ${repositories[0].name}`);
        const contributionStats = await fetchFromGitHub<{ all: number[] }>(
          `/repos/${username}/${repositories[0].name}/stats/participation`
        );
        
        if (contributionStats) {
          contributions.commits = contributionStats.all.reduce((sum, count) => sum + count, 0);
          console.log(`Total commits: ${contributions.commits}`);
        }
      } catch (error) {
        console.warn('Could not fetch contribution stats:', error);
      }
    }

    // Fetch issues count
    try {
      console.log(`Fetching issues for ${repositories[0]?.name || username}`);
      const issues = await fetchFromGitHub<any[]>(
        `/repos/${username}/${repositories[0]?.name || ''}/issues?state=all&per_page=1`
      );
      contributions.issues = issues.length;
      console.log(`Total issues: ${contributions.issues}`);
    } catch (error) {
      console.warn('Could not fetch issues count:', error);
    }

    // Fetch PRs count
    try {
      console.log(`Fetching PRs for ${repositories[0]?.name || username}`);
      const prs = await fetchFromGitHub<any[]>(
        `/repos/${username}/${repositories[0]?.name || ''}/pulls?state=all&per_page=1`
      );
      contributions.prs = prs.length;
      console.log(`Total PRs: ${contributions.prs}`);
    } catch (error) {
      console.warn('Could not fetch PRs count:', error);
    }

    const userData: GitHubUser = {
      username: user.login,
      contributions,
      techStack: Array.from(techStack),
      detailedTechStack,
      repositories: repositories.slice(0, 10), // Get top 10 repositories
    };

    console.log('Successfully fetched user data:', userData);
    return userData;
  } catch (error: any) {
    console.error('Error fetching GitHub data:', error);
    
    if (error.message === 'User not found') {
      throw new Error(`GitHub user "${username}" not found. Please check the username and try again.`);
    } else if (error.message === 'Rate limit exceeded') {
      throw new Error('GitHub API rate limit exceeded. Please try again in a few minutes.');
    } else {
      throw new Error(`Failed to fetch GitHub data: ${error.message}`);
    }
  }
} 