import jsPDF from 'jspdf';
import { useState } from 'react';
import type { GitHubUser } from '../lib/github';
import { Button } from './ui/button';

interface Recommendation {
  type: "profile" | "activity" | "collaboration" | "visibility";
  title: string;
  description: string;
  impact: "high" | "medium" | "low";
}

interface PDFData extends GitHubUser {
  recommendations?: Recommendation[];
}

interface PDFReportProps {
  username: string;
  data: {
    user1: PDFData;
    user2: PDFData;
  };
}

export function PDFReport({ username, data }: PDFReportProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generatePDF = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      const doc = new jsPDF();
      const margin = 20;
      let y = 20;

      // Title
      doc.setFontSize(24);
      doc.text('GitHub Profile Comparison', margin, y);
      y += 15;

      // Users being compared
      doc.setFontSize(16);
      doc.text(`${data.user1.username} vs ${data.user2.username}`, margin, y);
      y += 15;

      // Contributions Comparison
      doc.setFontSize(14);
      doc.text('Contributions Comparison', margin, y);
      y += 10;

      // Contributions table
      const contributions = [
        ['Metric', data.user1.username, data.user2.username],
        ['Commits', data.user1.contributions.commits.toString(), data.user2.contributions.commits.toString()],
        ['Pull Requests', data.user1.contributions.prs.toString(), data.user2.contributions.prs.toString()],
        ['Issues', data.user1.contributions.issues.toString(), data.user2.contributions.issues.toString()],
        ['Stars Received', data.user1.contributions.stars.toString(), data.user2.contributions.stars.toString()],
      ];

      // Simple table generation without autoTable
      const cellWidth = 60;
      const cellHeight = 10;
      const startX = margin;
      let currentX = startX;
      let currentY = y;

      // Draw headers
      contributions[0].forEach(header => {
        doc.setFontSize(10);
        doc.text(header, currentX, currentY);
        currentX += cellWidth;
      });

      currentY += cellHeight;
      currentX = startX;

      // Draw data rows
      contributions.slice(1).forEach(row => {
        row.forEach(cell => {
          doc.setFontSize(10);
          doc.text(cell, currentX, currentY);
          currentX += cellWidth;
        });
        currentY += cellHeight;
        currentX = startX;
      });

      y = currentY + 15;

      // Tech Stack Comparison
      doc.setFontSize(14);
      doc.text('Tech Stack Comparison', margin, y);
      y += 10;

      // Tech stack
      doc.setFontSize(10);
      doc.text(`${data.user1.username}: ${data.user1.techStack.join(', ')}`, margin, y);
      y += 10;
      doc.text(`${data.user2.username}: ${data.user2.techStack.join(', ')}`, margin, y);
      y += 15;

      // Top Repositories
      doc.setFontSize(14);
      doc.text('Top Repositories', margin, y);
      y += 10;

      // Repositories
      doc.setFontSize(10);
      data.user1.repositories.forEach(repo => {
        if (y > 270) { // Check if we need a new page
          doc.addPage();
          y = 20;
        }
        doc.text(`${data.user1.username} - ${repo.name} (${repo.language}) - ${repo.stars} stars`, margin, y);
        y += 10;
      });
      data.user2.repositories.forEach(repo => {
        if (y > 270) { // Check if we need a new page
          doc.addPage();
          y = 20;
        }
        doc.text(`${data.user2.username} - ${repo.name} (${repo.language}) - ${repo.stars} stars`, margin, y);
        y += 10;
      });

      // Recommendations Section
      if ((data.user1.recommendations && data.user1.recommendations.length > 0) || 
          (data.user2.recommendations && data.user2.recommendations.length > 0)) {
        if (y > 250) { // Check if we need a new page for recommendations
          doc.addPage();
          y = 20;
        }

        doc.setFontSize(14);
        doc.text('Recommendations', margin, y);
        y += 10;

        // User 1 Recommendations
        if (data.user1.recommendations && data.user1.recommendations.length > 0) {
          doc.setFontSize(12);
          doc.text(`${data.user1.username}'s Recommendations:`, margin, y);
          y += 10;

          doc.setFontSize(10);
          data.user1.recommendations.forEach(recommendation => {
            if (y > 270) { // Check if we need a new page
              doc.addPage();
              y = 20;
            }

            // Recommendation title with impact
            doc.setFont(undefined, 'bold');
            doc.text(`${recommendation.title} (${recommendation.impact.toUpperCase()} IMPACT)`, margin, y);
            y += 7;

            // Recommendation description
            doc.setFont(undefined, 'normal');
            const splitDescription = doc.splitTextToSize(recommendation.description, 170);
            doc.text(splitDescription, margin, y);
            y += 7 * splitDescription.length + 5;
          });
        }

        // User 2 Recommendations
        if (data.user2.recommendations && data.user2.recommendations.length > 0) {
          if (y > 250) { // Check if we need a new page
            doc.addPage();
            y = 20;
          }

          doc.setFontSize(12);
          doc.text(`${data.user2.username}'s Recommendations:`, margin, y);
          y += 10;

          doc.setFontSize(10);
          data.user2.recommendations.forEach(recommendation => {
            if (y > 270) { // Check if we need a new page
              doc.addPage();
              y = 20;
            }

            // Recommendation title with impact
            doc.setFont(undefined, 'bold');
            doc.text(`${recommendation.title} (${recommendation.impact.toUpperCase()} IMPACT)`, margin, y);
            y += 7;

            // Recommendation description
            doc.setFont(undefined, 'normal');
            const splitDescription = doc.splitTextToSize(recommendation.description, 170);
            doc.text(splitDescription, margin, y);
            y += 7 * splitDescription.length + 5;
          });
        }
      }

      // Save the PDF
      doc.save(`${username}-comparison.pdf`);
    } catch (err) {
      console.error('Error generating PDF:', err);
      setError('Failed to generate PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="mt-6 space-y-4">
      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      <Button 
        onClick={generatePDF} 
        className="w-full"
        disabled={isGenerating}
      >
        {isGenerating ? 'Generating PDF...' : 'Download Comparison Report'}
      </Button>
    </div>
  );
} 