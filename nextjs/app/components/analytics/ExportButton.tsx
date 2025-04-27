'use client';

import React, { useState } from 'react';
import { Download } from 'lucide-react';

interface ExportButtonProps {
  reportType: 'summary' | 'pageviews' | 'visitors';
  startDate?: Date;
  endDate?: Date;
  className?: string;
}

export default function ExportButton({ 
  reportType, 
  startDate, 
  endDate, 
  className 
}: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      
      // Build query params
      const params = new URLSearchParams();
      params.append('type', reportType);
      
      if (startDate) {
        params.append('startDate', startDate.toISOString().split('T')[0]);
      }
      
      if (endDate) {
        params.append('endDate', endDate.toISOString().split('T')[0]);
      }
      
      // Create URL for export endpoint
      const url = `/api/analytics/export?${params.toString()}`;
      
      // Trigger download by creating a link and clicking it
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', ''); // Let the server set the filename
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error exporting data:', error);
    } finally {
      setIsExporting(false);
    }
  };

  // Get button text based on report type
  const getButtonText = () => {
    switch (reportType) {
      case 'summary':
        return 'Export Summary';
      case 'pageviews':
        return 'Export Page Views';
      case 'visitors':
        return 'Export Visitors';
      default:
        return 'Export Data';
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={isExporting}
      className={`flex items-center gap-2 px-4 py-2 rounded-md bg-foreground/5 hover:bg-foreground/10 transition-colors text-sm font-medium ${className}`}
    >
      <Download className="h-4 w-4" />
      <span>{isExporting ? 'Exporting...' : getButtonText()}</span>
    </button>
  );
} 