'use client';

import React, { useState } from 'react';
import { Calendar } from 'lucide-react';

interface DateRangePickerProps {
  startDate: Date;
  endDate: Date;
  onChange: (startDate: Date, endDate: Date) => void;
  className?: string;
}

/**
 * Predefined date range options
 */
type DateRange = 
  | '7d' 
  | '30d' 
  | '90d' 
  | 'thisMonth' 
  | 'lastMonth' 
  | 'custom';

/**
 * A component for selecting date ranges
 */
export default function DateRangePicker({
  startDate,
  endDate,
  onChange,
  className
}: DateRangePickerProps) {
  // State for the dropdown
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState<DateRange>('7d');
  
  // State for custom date inputs
  const [customStartDate, setCustomStartDate] = useState(startDate.toISOString().split('T')[0]);
  const [customEndDate, setCustomEndDate] = useState(endDate.toISOString().split('T')[0]);
  
  /**
   * Get a human-readable label for the selected date range
   */
  const getDateRangeLabel = (): string => {
    const formatDate = (date: Date) => date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined 
    });
    
    switch (selectedRange) {
      case '7d':
        return 'Last 7 days';
      case '30d':
        return 'Last 30 days';
      case '90d':
        return 'Last 90 days';
      case 'thisMonth':
        return 'This month';
      case 'lastMonth':
        return 'Last month';
      case 'custom':
        return `${formatDate(startDate)} - ${formatDate(endDate)}`;
      default:
        return 'Select date range';
    }
  };
  
  /**
   * Apply a predefined date range
   */
  const applyPredefinedRange = (range: DateRange) => {
    setSelectedRange(range);
    
    const today = new Date();
    let start = new Date();
    let end = new Date();
    
    switch (range) {
      case '7d':
        start.setDate(today.getDate() - 7);
        break;
      case '30d':
        start.setDate(today.getDate() - 30);
        break;
      case '90d':
        start.setDate(today.getDate() - 90);
        break;
      case 'thisMonth':
        start = new Date(today.getFullYear(), today.getMonth(), 1);
        end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        break;
      case 'lastMonth':
        start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        end = new Date(today.getFullYear(), today.getMonth(), 0);
        break;
      case 'custom':
        // Don't change dates for custom, just show the inputs
        setIsOpen(true);
        return;
    }
    
    // Set time to start of day for start date, end of day for end date
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
    
    // Update custom date inputs
    setCustomStartDate(start.toISOString().split('T')[0]);
    setCustomEndDate(end.toISOString().split('T')[0]);
    
    // Call the onChange handler
    onChange(start, end);
    
    // Close the dropdown for predefined ranges
    if (range !== 'custom' as DateRange) {
      setIsOpen(false);
    }
  };
  
  /**
   * Apply a custom date range
   */
  const applyCustomRange = () => {
    // Parse the input dates
    const start = new Date(customStartDate);
    start.setHours(0, 0, 0, 0);
    
    const end = new Date(customEndDate);
    end.setHours(23, 59, 59, 999);
    
    // Call the onChange handler
    onChange(start, end);
    
    // Close the dropdown
    setIsOpen(false);
  };
  
  /**
   * Format a date for display in the input
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const formatDateForDisplay = (date: Date): string => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined 
    });
  };
  
  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-foreground/5 hover:bg-foreground/10 rounded-md text-sm transition-colors"
      >
        <Calendar className="h-4 w-4" />
        <span>{getDateRangeLabel()}</span>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-card rounded-md shadow-lg border border-foreground/10 z-50">
          <div className="p-4">
            <div className="space-y-2">
              <button
                onClick={() => applyPredefinedRange('7d')}
                className={`w-full text-left px-3 py-2 rounded-md transition-colors ${selectedRange === '7d' ? 'bg-primary text-primary-foreground' : 'hover:bg-foreground/5'}`}
              >
                Last 7 days
              </button>
              <button
                onClick={() => applyPredefinedRange('30d')}
                className={`w-full text-left px-3 py-2 rounded-md transition-colors ${selectedRange === '30d' ? 'bg-primary text-primary-foreground' : 'hover:bg-foreground/5'}`}
              >
                Last 30 days
              </button>
              <button
                onClick={() => applyPredefinedRange('90d')}
                className={`w-full text-left px-3 py-2 rounded-md transition-colors ${selectedRange === '90d' ? 'bg-primary text-primary-foreground' : 'hover:bg-foreground/5'}`}
              >
                Last 90 days
              </button>
              <button
                onClick={() => applyPredefinedRange('thisMonth')}
                className={`w-full text-left px-3 py-2 rounded-md transition-colors ${selectedRange === 'thisMonth' ? 'bg-primary text-primary-foreground' : 'hover:bg-foreground/5'}`}
              >
                This month
              </button>
              <button
                onClick={() => applyPredefinedRange('lastMonth')}
                className={`w-full text-left px-3 py-2 rounded-md transition-colors ${selectedRange === 'lastMonth' ? 'bg-primary text-primary-foreground' : 'hover:bg-foreground/5'}`}
              >
                Last month
              </button>
              <button
                onClick={() => applyPredefinedRange('custom')}
                className={`w-full text-left px-3 py-2 rounded-md transition-colors ${selectedRange === 'custom' ? 'bg-primary text-primary-foreground' : 'hover:bg-foreground/5'}`}
              >
                Custom range
              </button>
            </div>
            
            {selectedRange === 'custom' && (
              <div className="mt-4 space-y-3">
                <div>
                  <label className="block text-xs mb-1 text-foreground/70">Start date</label>
                  <input
                    type="date"
                    value={customStartDate}
                    onChange={(e) => setCustomStartDate(e.target.value)}
                    className="w-full px-3 py-1 border border-foreground/10 rounded-md bg-foreground/5"
                  />
                </div>
                <div>
                  <label className="block text-xs mb-1 text-foreground/70">End date</label>
                  <input
                    type="date"
                    value={customEndDate}
                    onChange={(e) => setCustomEndDate(e.target.value)}
                    className="w-full px-3 py-1 border border-foreground/10 rounded-md bg-foreground/5"
                  />
                </div>
                <button
                  onClick={applyCustomRange}
                  className="w-full px-3 py-2 mt-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                >
                  Apply Custom Range
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 