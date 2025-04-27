'use client';

import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Eye, 
  MousePointer, 
  Clock, 
  ArrowRight,
  Layers
} from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  change?: number;
  icon?: 'users' | 'views' | 'clicks' | 'duration' | 'bounce' | 'projects';
  loading?: boolean;
}

export default function StatsCard({
  title,
  value,
  description,
  change,
  icon,
  loading = false,
}: StatsCardProps) {
  // Determine icon component based on the icon prop
  const IconComponent = () => {
    switch (icon) {
      case 'users':
        return <Users className="h-5 w-5 text-blue-500" />;
      case 'views':
        return <Eye className="h-5 w-5 text-purple-500" />;
      case 'clicks':
        return <MousePointer className="h-5 w-5 text-orange-500" />;
      case 'duration':
        return <Clock className="h-5 w-5 text-teal-500" />;
      case 'bounce':
        return <ArrowRight className="h-5 w-5 text-red-500" />;
      case 'projects':
        return <Layers className="h-5 w-5 text-indigo-500" />;
      default:
        return null;
    }
  };

  // Format change for display with appropriate color and icon
  const renderChange = () => {
    if (change === undefined) return null;
    
    const isPositive = change >= 0;
    const displayChange = `${isPositive ? '+' : ''}${change.toFixed(1)}%`;
    
    // For bounce rate, a negative change is actually good
    const isGood = icon === 'bounce' ? !isPositive : isPositive;
    
    // Skip rendering if change is exactly 0
    if (change === 0) return null;
    
    return (
      <span className={`flex items-center text-sm font-medium ${isGood ? 'text-green-500' : 'text-red-500'}`}>
        {isPositive ? <TrendingUp className="mr-1 h-3 w-3" /> : <TrendingDown className="mr-1 h-3 w-3" />}
        {displayChange}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="bg-foreground/5 rounded-xl p-6 shadow-sm animate-pulse">
        <div className="h-4 bg-foreground/10 rounded w-1/3 mb-3"></div>
        <div className="h-8 bg-foreground/10 rounded w-2/3 mb-2"></div>
        <div className="h-4 bg-foreground/10 rounded w-1/2"></div>
      </div>
    );
  }

  return (
    <div className="bg-foreground/5 rounded-xl p-6 shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
          <h3 className="text-2xl font-bold">{value}</h3>
          {description && (
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          )}
        </div>
        <div className="flex flex-col items-end">
          {IconComponent()}
          <div className="mt-2">
            {renderChange()}
          </div>
        </div>
      </div>
    </div>
  );
} 