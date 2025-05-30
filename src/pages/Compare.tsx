import { useState } from 'react';
import { PDFReport } from '../components/PDFReport';
import { UserComparison } from '../components/UserComparison';
import type { GitHubUser } from '../lib/github';

interface ComparisonData {
  user1: GitHubUser;
  user2: GitHubUser;
}

export default function Compare() {
  const [comparisonData, setComparisonData] = useState<ComparisonData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCompare = (data: ComparisonData) => {
    try {
      setComparisonData(data);
      setError(null);
    } catch (err) {
      setError('Failed to compare users. Please try again.');
      console.error('Comparison error:', err);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Compare GitHub Profiles</h1>
      <UserComparison onCompare={handleCompare} />
      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      {comparisonData && !error && (
        <div className="mt-8">
          <PDFReport
            username={`${comparisonData.user1.username}-vs-${comparisonData.user2.username}`}
            data={comparisonData}
          />
        </div>
      )}
    </div>
  );
} 