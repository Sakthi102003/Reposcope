import { ChangeEvent, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { fetchUserData, type GitHubUser } from '../lib/github';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Skeleton } from './ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface UserComparisonProps {
  onCompare: (data: { user1: GitHubUser; user2: GitHubUser }) => void;
}

interface ChartDataItem {
  name: string;
  user1: number;
  user2: number;
}

export function UserComparison({ onCompare }: UserComparisonProps) {
  const [user1, setUser1] = useState('');
  const [user2, setUser2] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [comparisonData, setComparisonData] = useState<{ user1: GitHubUser; user2: GitHubUser } | null>(null);

  const handleCompare = async () => {
    if (!user1 || !user2) {
      setError('Please enter both usernames');
      return;
    }

    setLoading(true);
    setError(null);
    setComparisonData(null);

    try {
      const [user1Data, user2Data] = await Promise.all([
        fetchUserData(user1),
        fetchUserData(user2)
      ]);

      const data = { user1: user1Data, user2: user2Data };
      setComparisonData(data);
      onCompare(data);
    } catch (err) {
      setError('Failed to fetch user data. Please check the usernames and try again.');
      console.error('Error comparing users:', err);
    } finally {
      setLoading(false);
    }
  };

  const chartData: ChartDataItem[] = comparisonData ? [
    { name: 'Commits', user1: comparisonData.user1.contributions.commits, user2: comparisonData.user2.contributions.commits },
    { name: 'PRs', user1: comparisonData.user1.contributions.prs, user2: comparisonData.user2.contributions.prs },
    { name: 'Issues', user1: comparisonData.user1.contributions.issues, user2: comparisonData.user2.contributions.issues },
    { name: 'Stars', user1: comparisonData.user1.contributions.stars, user2: comparisonData.user2.contributions.stars },
  ] : [];

  const handleUser1Change = (e: ChangeEvent<HTMLInputElement>) => setUser1(e.target.value);
  const handleUser2Change = (e: ChangeEvent<HTMLInputElement>) => setUser2(e.target.value);

  if (loading) {
    return (
      <div className="space-y-6">
        <Card className="p-6">
          <Skeleton className="h-8 w-64 mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <Skeleton className="h-10" />
            <Skeleton className="h-10" />
          </div>
          <Skeleton className="h-10 w-32" />
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Compare GitHub Profiles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="user1" className="block text-sm font-medium mb-2">
              First GitHub Username
            </label>
            <Input
              id="user1"
              value={user1}
              onChange={handleUser1Change}
              placeholder="Enter GitHub username"
              disabled={loading}
            />
          </div>
          <div>
            <label htmlFor="user2" className="block text-sm font-medium mb-2">
              Second GitHub Username
            </label>
            <Input
              id="user2"
              value={user2}
              onChange={handleUser2Change}
              placeholder="Enter GitHub username"
              disabled={loading}
            />
          </div>
        </div>
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
        <Button 
          onClick={handleCompare} 
          disabled={loading || !user1 || !user2}
          className="w-full md:w-auto"
        >
          {loading ? 'Comparing...' : 'Compare Profiles'}
        </Button>
      </Card>

      {comparisonData && (
        <Tabs defaultValue="contributions" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="contributions">Contributions</TabsTrigger>
            <TabsTrigger value="tech-stack">Tech Stack</TabsTrigger>
            <TabsTrigger value="repositories">Repositories</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="contributions" className="mt-4">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Contributions Comparison</h3>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="user1" name={comparisonData.user1.username} fill="#8884d8" />
                    <Bar dataKey="user2" name={comparisonData.user2.username} fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="tech-stack" className="mt-4">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Tech Stack Comparison</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2">{comparisonData.user1.username}</h4>
                  <div className="flex flex-wrap gap-2">
                    {comparisonData.user1.techStack.map((tech: string) => (
                      <span key={tech} className="px-3 py-1 bg-primary/10 rounded-full text-sm">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">{comparisonData.user2.username}</h4>
                  <div className="flex flex-wrap gap-2">
                    {comparisonData.user2.techStack.map((tech: string) => (
                      <span key={tech} className="px-3 py-1 bg-primary/10 rounded-full text-sm">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="repositories" className="mt-4">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Top Repositories</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2">{comparisonData.user1.username}</h4>
                  <div className="space-y-4">
                    {comparisonData.user1.repositories.map((repo) => (
                      <div key={repo.name} className="p-4 border rounded-lg">
                        <p className="font-medium">{repo.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {repo.language} • {repo.stars} stars
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">{comparisonData.user2.username}</h4>
                  <div className="space-y-4">
                    {comparisonData.user2.repositories.map((repo) => (
                      <div key={repo.name} className="p-4 border rounded-lg">
                        <p className="font-medium">{repo.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {repo.language} • {repo.stars} stars
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="mt-4">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Activity Timeline</h3>
              <p className="text-muted-foreground">Activity timeline will be implemented in a future update.</p>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
} 