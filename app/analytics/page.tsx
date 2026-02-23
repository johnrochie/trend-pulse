import AnalyticsDashboard from '@/components/AnalyticsDashboard';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Analytics Dashboard | Trend Pulse',
  description: 'Track website performance, traffic, and automation health',
};

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900">
      <AnalyticsDashboard />
    </div>
  );
}