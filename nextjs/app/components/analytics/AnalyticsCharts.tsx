'use client';

import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  TimeScale
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import { enUS } from 'date-fns/locale';
import { Line } from 'react-chartjs-2';
import { 
  eachDayOfInterval, 
  isSameDay, 
  format, 
  startOfDay,
  differenceInCalendarDays,
  endOfDay 
} from 'date-fns';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  TimeScale
);

// Define chart options
const lineOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    tooltip: {
      mode: 'index' as const,
      intersect: false,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: 'rgba(200, 200, 200, 0.1)',
      },
    },
    x: {
      grid: {
        display: false,
      },
      ticks: {
        maxRotation: 45,
        minRotation: 45,
      }
    },
  },
  interaction: {
    mode: 'nearest' as const,
    axis: 'x' as const,
    intersect: false,
  },
  elements: {
    line: {
      tension: 0.3,
    },
    point: {
      radius: 2,
      hoverRadius: 5,
    },
  },
};

// Color theme
const colors = {
  blue: {
    fill: 'rgba(59, 130, 246, 0.2)',
    stroke: 'rgba(59, 130, 246, 1)',
  },
  purple: {
    fill: 'rgba(139, 92, 246, 0.2)',
    stroke: 'rgba(139, 92, 246, 1)',
  },
  teal: {
    fill: 'rgba(20, 184, 166, 0.2)',
    stroke: 'rgba(20, 184, 166, 1)',
  },
};

interface AnalyticsChartsProps {
  summaries: Array<{
    date: Date | string;
    totalVisits: number;
    uniqueVisitors: number;
    sessionCount: number;
    bounceRate: number;
  }>;
  pageViews: Array<{
    name: string;
    value: number;
  }>;
  referrers: Array<{
    name: string;
    value: number;
  }>;
}

export default function AnalyticsCharts({
  summaries,
}: AnalyticsChartsProps) {
  // Debug the incoming data
  console.log('Raw summaries data:', JSON.stringify(summaries, null, 2));

  // Convert and normalize all dates to proper JavaScript Date objects
  const normalizedSummaries = useMemo(() => {
    return summaries.map(summary => {
      // Handle string or Date objects
      let dateObj;
      if (typeof summary.date === 'string') {
        // Parse ISO string to Date
        dateObj = new Date(summary.date);
        // Reset time to start of day for consistent comparison
        dateObj = startOfDay(dateObj);
      } else if (summary.date instanceof Date) {
        // Use existing Date but reset time to start of day
        dateObj = startOfDay(new Date(summary.date));
      } else {
        // Fallback to current date if invalid
        console.error('Invalid date format:', summary.date);
        dateObj = startOfDay(new Date());
      }
      
      return {
        ...summary,
        date: dateObj,
        // Ensure numeric values
        uniqueVisitors: Number(summary.uniqueVisitors) || 0,
        sessionCount: Number(summary.sessionCount) || 0,
        totalVisits: Number(summary.totalVisits) || 0,
        bounceRate: Number(summary.bounceRate) || 0
      };
    });
  }, [summaries]);
  
  // Sort summaries by date (oldest to newest)
  const sortedSummaries = useMemo(() => {
    return [...normalizedSummaries].sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [normalizedSummaries]);
  
  // Generate a complete dataset with all dates in the range
  const completeDataset = useMemo(() => {
    // Handle empty data case
    if (sortedSummaries.length === 0) {
      const today = new Date();
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      // Create a dataset with the last 30 days, all with zero values
      return eachDayOfInterval({
        start: startOfDay(thirtyDaysAgo),
        end: endOfDay(today)
      }).map(date => ({
        date,
        uniqueVisitors: 0,
        sessionCount: 0,
        totalVisits: 0,
        bounceRate: 0
      }));
    }
    
    // Debug sorted data
    console.log('Sorted summaries:', sortedSummaries.map(s => ({
      date: s.date.toISOString(),
      uniqueVisitors: s.uniqueVisitors,
      sessionCount: s.sessionCount
    })));
    
    // Find min and max dates
    const minDate = sortedSummaries[0].date;
    const maxDate = sortedSummaries[sortedSummaries.length - 1].date;
    
    console.log('Date range:', { 
      minDate: minDate.toISOString(),
      maxDate: maxDate.toISOString()
    });
    
    // Calculate the number of days in the range
    const daysDiff = differenceInCalendarDays(maxDate, minDate);
    console.log('Days in range:', daysDiff);
    
    // For very large date ranges, limit the number of points to prevent performance issues
    // For 300+ days, switch to a weekly aggregation instead
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let interval;
    if (daysDiff > 300) {
      console.log('Using weekly aggregation for large date range');
      // Implementation for weekly aggregation would go here if needed
      // For now, we'll still use daily with a warning
      console.warn('Large date range detected. Performance may be affected.');
    }
    
    // Generate all dates in the range
    const allDates = eachDayOfInterval({ 
      start: startOfDay(minDate), 
      end: endOfDay(maxDate) 
    });
    console.log(`Generated ${allDates.length} dates in the interval`);
    
    // Create a map of existing data by date string
    const dataByDate = new Map();
    sortedSummaries.forEach(summary => {
      const dateKey = format(summary.date, 'yyyy-MM-dd');
      dataByDate.set(dateKey, summary);
    });
    
    // Fill in all dates, using zeros for missing data
    const result = allDates.map(date => {
      const dateKey = format(date, 'yyyy-MM-dd');
      
      // Debug date comparison if today
      if (isSameDay(date, new Date())) {
        console.log('[Chart] Checking today\'s data:', {
          dateKey,
          hasData: dataByDate.has(dateKey),
          existingData: dataByDate.get(dateKey),
        });
      }
      
      if (dataByDate.has(dateKey)) {
        return dataByDate.get(dateKey);
      } else {
        // Create data point with zeros for this date
        return {
          date,
          uniqueVisitors: 0,
          sessionCount: 0,
          totalVisits: 0,
          bounceRate: 0
        };
      }
    });
    
    console.log(`Completed dataset has ${result.length} data points`);
    return result;
  }, [sortedSummaries]);
  
  // Determine appropriate time unit based on date range
  const { unit, 
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    tooltipFormat 
  } = useMemo(() => {
    if (completeDataset.length <= 1) {
      return { unit: 'day', tooltipFormat: 'PP' };
    }
    
    const firstDate = completeDataset[0].date;
    const lastDate = completeDataset[completeDataset.length - 1].date;
    const daysDiff = Math.round((lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff <= 14) {
      return { unit: 'day', tooltipFormat: 'PP' }; // Short range
    } else if (daysDiff <= 60) {
      return { unit: 'day', tooltipFormat: 'PP' }; // Medium range
    } else if (daysDiff <= 365) {
      return { unit: 'month', tooltipFormat: 'MMM yyyy' }; // Long range
    } else {
      return { unit: 'year', tooltipFormat: 'yyyy' }; // Very long range
    }
  }, [completeDataset]);
  
  // Format data for traffic over time chart
  const trafficData = {
    datasets: [
      {
        label: 'Website Visits',
        data: completeDataset.map(s => ({
          x: s.date,
          y: s.sessionCount || 0
        })),
        borderColor: colors.blue.stroke,
        backgroundColor: colors.blue.fill,
        fill: true,
      },
      {
        label: 'Unique Visitors',
        data: completeDataset.map(s => {
          console.log('Full data point:', s);
          return {
            x: s.date,
            y: s.uniqueVisitors || 0
          };
        }),
        borderColor: colors.purple.stroke,
        backgroundColor: colors.purple.fill,
        fill: true,
      },
    ],
  };
  
  // Create chart options with appropriate time settings
  const chartOptions = {
    ...lineOptions,
    scales: {
      ...lineOptions.scales,
      x: {
        ...lineOptions.scales.x,
        type: 'time' as const,
        time: {
          unit: unit as 'day' | 'month' | 'year',
          displayFormats: {
            day: 'MMM d',
            month: 'MMM yyyy',
            year: 'yyyy'
          }
        },
        adapters: {
          date: {
            locale: enUS
          }
        }
      }
    },
    plugins: {
      ...lineOptions.plugins,
      tooltip: {
        ...lineOptions.plugins.tooltip,
        callbacks: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          title: function(context: any) {
            // Safely format the date in the tooltip
            const date = context[0]?.raw?.x || null;
            if (date) {
              try {
                return new Date(date).toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                });
              } catch (e) {
                console.error('Error formatting date:', e);
                return 'Unknown date';
              }
            }
            return 'Unknown date';
          },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          label: function(context: any) {
            if (!context || !context.dataset) {
              return '';
            }
            
            // Get the actual value from the data point
            const value = context.raw?.y || 0;
            const label = context.dataset.label || '';
            
            // Format the value without decimals and with thousands separators
            return `${label}: ${Math.round(value).toLocaleString()}`;
          }
        }
      }
    }
  };

  return (
    <div className="h-full w-full">
      <Line options={chartOptions} data={trafficData} />
    </div>
  );
} 