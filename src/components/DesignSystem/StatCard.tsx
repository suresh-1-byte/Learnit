import React, { useState, useEffect, memo } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export interface StatCardProps {
  title: string;
  value: number | string;
  change?: number;
  changeLabel?: string;
  icon?: React.ReactNode;
  sparkline?: number[];
  gradient?: 'purple' | 'green' | 'blue' | 'orange' | 'red';
  className?: string;
}

export const StatCard = memo<StatCardProps>(({
  title,
  value,
  change,
  changeLabel = 'vs last month',
  icon,
  sparkline,
  gradient = 'purple',
  className = ''
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  const numericValue = typeof value === 'number' ? value : parseFloat(value.replace(/[^0-9.-]+/g, ''));

  useEffect(() => {
    const duration = 1500;
    const steps = 60;
    const increment = numericValue / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= numericValue) {
        setDisplayValue(numericValue);
        clearInterval(timer);
      } else {
        setDisplayValue(current);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [numericValue]);

  const gradientColors = {
    purple: 'from-[#6366F1] to-[#8B5CF6]',
    green: 'from-[#10B981] to-[#34D399]',
    blue: 'from-[#3B82F6] to-[#60A5FA]',
    orange: 'from-[#F59E0B] to-[#FBBF24]',
    red: 'from-[#EF4444] to-[#F87171]',
  };

  const isPositive = change !== undefined && change >= 0;

  const formatValue = (val: number) => {
    if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `${(val / 1000).toFixed(1)}K`;
    return val.toFixed(0);
  };

  const maxSparkline = sparkline ? Math.max(...sparkline) : 0;
  const minSparkline = sparkline ? Math.min(...sparkline) : 0;

  return (
    <div className={`relative bg-[#0A0A0A] rounded-2xl border border-[#1A1A1A] p-6 overflow-hidden group hover:border-[#2A2A2A] hover:shadow-xl hover:shadow-black/20 hover:-translate-y-0.5 transition-all duration-300 ${className}`}>
      {/* Gradient Border Effect */}
      <div className={`absolute inset-0 bg-gradient-to-r ${gradientColors[gradient]} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
      
      {/* Glass Reflection */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-2xl group-hover:from-white/10 transition-all duration-300" />

      <div className="relative">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-xs font-mono uppercase text-[#666] font-bold tracking-wider">{title}</p>
            <h3 className="text-2xl font-bold text-white mt-1">
              {typeof value === 'string' ? value : formatValue(displayValue)}
            </h3>
          </div>
          {icon && (
            <div className={`p-2 rounded-xl bg-gradient-to-br ${gradientColors[gradient]} bg-opacity-10`}>
              {icon}
            </div>
          )}
        </div>

        {/* Trend Indicator */}
        {change !== undefined && (
          <div className="flex items-center gap-2 mb-4">
            <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold ${
              isPositive 
                ? 'bg-emerald-500/10 text-emerald-400' 
                : 'bg-red-500/10 text-red-400'
            }`}>
              {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              <span>{Math.abs(change)}%</span>
            </div>
            <span className="text-xs text-[#666]">{changeLabel}</span>
          </div>
        )}

        {/* Sparkline */}
        {sparkline && sparkline.length > 0 && (
          <div className="h-12 flex items-end gap-0.5">
            {sparkline.map((point, index) => {
              const height = ((point - minSparkline) / (maxSparkline - minSparkline)) * 100;
              return (
                <div
                  key={index}
                  className={`flex-1 rounded-t-sm bg-gradient-to-t ${gradientColors[gradient]} opacity-60 hover:opacity-100 transition-opacity`}
                  style={{ height: `${Math.max(height, 5)}%` }}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
});

StatCard.displayName = 'StatCard';
