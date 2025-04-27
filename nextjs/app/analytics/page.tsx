'use client';

import React, { useState, useEffect } from 'react';
import DateRangePicker from '../components/analytics/DateRangePicker';
import ExportButton from '../components/analytics/ExportButton';
import StatsCard from '../components/analytics/StatsCard';
import AnalyticsCharts from '../components/analytics/AnalyticsCharts';
import { useAuth } from '../components/auth/AuthContext';

// Type definitions
interface Summary {
  id: number;
  date: string | Date; // Accept either string or Date
  totalVisits: number;
  uniqueVisitors: number;
  popularPages: Array<{ path: string; count: number }>;
  sessionCount?: number;
}

interface PageView {
  name: string;
  value: number;
}

interface ProjectView {
  name: string;
  value: number;
}

interface Stats {
  totalVisitors: number;
  newVisitors: number;
  visitorGrowth: number;
  totalPageViews: number;
  pageViewGrowth: number;
  totalSessions: number;
  sessionGrowth: number;
}

// Define a type for the raw summary data from API
interface RawSummary {
  id: number;
  date: string;
  totalVisits: number;
  uniqueVisitors: number;
  popularPages: Array<{ path: string; count: number }>;
  sessionCount?: number;
  createdAt: string;
  updatedAt: string;
}

export default function AnalyticsDashboard() {
  // State for loading
  const [loading, setLoading] = useState(true);
  
  // Get auth context to check if user is an admin
  // We use isLoggedIn when making the updateAnalytics API call
  const { isLoggedIn } = useAuth();
  
  // Set default date range (last 7 days)
  const today = new Date();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(today.getDate() - 7);
  
  const [startDate, setStartDate] = useState(sevenDaysAgo);
  const [endDate, setEndDate] = useState(today);
  
  // State for analytics data
  const [summaries, setSummaries] = useState<Summary[]>([]);
  const [pageViews, setPageViews] = useState<PageView[]>([]);
  // We keep the popularProjects state for future feature expansion
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [popularProjects, setPopularProjects] = useState<ProjectView[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch analytics data
  const fetchAnalyticsData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Format dates for API query
      const formattedStartDate = startDate.toISOString().split('T')[0];
      const formattedEndDate = endDate.toISOString().split('T')[0];
      
      // Add a timestamp to prevent browser caching
      const timestamp = new Date().getTime();
      const url = `/api/analytics/data?startDate=${formattedStartDate}&endDate=${formattedEndDate}&t=${timestamp}`;
      console.log('Fetching analytics data from:', url);
      
      // Fetch data from API with API key header
      const response = await fetch(url, {
        headers: {
          'x-api-key': 'test-key'
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('API error response:', response.status, response.statusText, errorData);
        throw new Error(`Failed to fetch analytics data: ${response.status} ${response.statusText}${errorData ? ` - ${JSON.stringify(errorData)}` : ''}`);
      }
      
      const data = await response.json();
      console.log('Received analytics data:', data);
      
      // Process summaries to ensure dates are Date objects
      const processedSummaries = (data.summaries || []).map((summary: RawSummary) => {
        // Output each summary to the console for debugging
        const date = new Date(summary.date);
        console.log(`Processing summary: date=${date.toISOString()}, uniqueVisitors=${summary.uniqueVisitors}, sessionCount=${summary.sessionCount}`);
        
        return {
          ...summary,
          date
        };
      });
      
      // Update state with fetched data
      setSummaries(processedSummaries);
      setPageViews(data.pageViews || []);
      setPopularProjects(data.popularProjects || []);
      setStats(data.stats || null);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      setError(error instanceof Error ? error.message : String(error));
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when date range changes
  useEffect(() => {
    fetchAnalyticsData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate]);

  // Set up automatic refresh every 10 seconds
  useEffect(() => {
    const refreshInterval = 10000; // 10 seconds
    
    console.log(`Setting up data auto-refresh every ${refreshInterval/1000}s`);
    
    // Create refresh interval
    const intervalId = setInterval(async () => {
      console.log('Auto-refreshing analytics data...');
      
      try {
        // First update analytics via cron endpoint
        const updateResponse = await fetch('/api/cron/updateAnalytics', {
          headers: {
            // Add a custom header to identify admin requests
            'x-is-admin': isLoggedIn ? 'true' : 'false'
          }
        });
        
        if (!updateResponse.ok) {
          console.warn('Analytics update failed:', updateResponse.status, updateResponse.statusText);
        } else {
          console.log('Analytics update successful');
        }
        
        // Then fetch fresh data
        await fetchAnalyticsData();
      } catch (error) {
        console.error('Error during data refresh:', error);
        // Continue silently
      }
    }, refreshInterval);
    
    // Clean up interval on unmount
    return () => {
      console.log('Cleaning up refresh interval');
      clearInterval(intervalId);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array means this runs once on mount

  // Handle date range change
  const handleDateRangeChange = (start: Date, end: Date) => {
    setStartDate(start);
    setEndDate(end);
  };

  // Prepare data for charts
  const prepareChartData = () => {
    // For each summary, add a placeholder bounceRate of 0 since we no longer track it
    const summariesWithBounceRate = summaries.map(summary => ({
      ...summary,
      bounceRate: 0,
      // Ensure sessionCount is included with a default of 0 if missing
      sessionCount: summary.sessionCount || 0
    }));
    
    return {
      summaries: summariesWithBounceRate,
      pageViews,
      referrers: [] // Empty array since we no longer track referrers
    };
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Analytics Dashboard</h1>
          <p className="text-foreground/70">
            Track visitor engagement and understand your audience
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <DateRangePicker
            startDate={startDate}
            endDate={endDate}
            onChange={handleDateRangeChange}
          />
          <ExportButton
            reportType="summary"
            startDate={startDate}
            endDate={endDate}
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-4 py-3 rounded-lg mb-8">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium">Error loading analytics data</h3>
              <div className="mt-2 text-sm">
                <p>{error}</p>
                <p className="mt-2">
                  <button 
                    onClick={fetchAnalyticsData}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Try Again
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {loading && (
        <div className="fixed top-4 right-4 bg-primary text-white px-3 py-1.5 rounded-full text-sm font-medium shadow-lg flex items-center gap-2">
          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Refreshing data...
        </div>
      )}

      {loading && !stats ? (
        // Initial loading state
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {[...Array(2)].map((_, index) => (
            <StatsCard
              key={index}
              title="Loading..."
              value="--"
              loading={true}
            />
          ))}
        </div>
      ) : (
        <>
          {/* Overview stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {stats && (
              <>
                <StatsCard
                  title="Unique Visitors"
                  value={stats.totalVisitors}
                  description={`${stats.newVisitors} new visitors`}
                  change={stats.visitorGrowth}
                  icon="users"
                />
                <StatsCard
                  title="Website Visits"
                  value={stats.totalSessions}
                  change={stats.sessionGrowth}
                  icon="views"
                />
              </>
            )}
          </div>

          {/* Traffic over time chart */}
          {summaries.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Traffic Over Time</h2>
              <div className="bg-foreground/5 rounded-xl p-6 shadow-sm">
                <div className="h-80">
                  <AnalyticsCharts {...prepareChartData()} />
                </div>
              </div>
            </div>
          )}

          {/* Popular Pages */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Popular Pages</h2>
            <div className="bg-foreground/5 rounded-xl p-6 shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-foreground/10">
                    <th className="text-left py-3 px-4 font-medium">Page</th>
                    <th className="text-right py-3 px-4 font-medium">Views</th>
                  </tr>
                </thead>
                <tbody>
                  {pageViews.length > 0 ? (
                    pageViews.map((page, index) => (
                      <tr key={index} className="border-b border-foreground/10 hover:bg-foreground/10">
                        <td className="py-3 px-4">{page.name}</td>
                        <td className="text-right py-3 px-4">{page.value}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={2} className="py-4 px-4 text-center text-foreground/70">
                        No data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Daily Traffic */}
          <h2 className="text-2xl font-bold mb-6">Daily Traffic</h2>
          <div className="bg-foreground/5 rounded-xl p-6 shadow-sm overflow-x-auto mb-12">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-foreground/10">
                  <th className="text-left py-3 px-4 font-medium">Date</th>
                  <th className="text-right py-3 px-4 font-medium">Visitors</th>
                  <th className="text-right py-3 px-4 font-medium">Website Visits</th>
                </tr>
              </thead>
              <tbody>
                {summaries.length > 0 ? (
                  // Sort summaries by date (newest first) before rendering
                  [...summaries]
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map((summary) => (
                      <tr key={summary.id} className="border-b border-foreground/10 hover:bg-foreground/10">
                        <td className="py-3 px-4">
                          {new Date(summary.date).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </td>
                        <td className="text-right py-3 px-4">{summary.uniqueVisitors}</td>
                        <td className="text-right py-3 px-4">{summary.sessionCount || 0}</td>
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td colSpan={3} className="py-4 px-4 text-center text-foreground/70">
                      No data available for the selected date range
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Export options */}
          <div className="bg-foreground/5 rounded-xl p-6 shadow-sm mb-8">
            <h3 className="text-xl font-medium mb-4">Export Data</h3>
            <p className="text-foreground/70 mb-6">
              Download analytics data for further analysis
            </p>
            <ExportButton
              reportType="summary"
              startDate={startDate}
              endDate={endDate}
            />
          </div>
        </>
      )}
    </div>
  );
} 