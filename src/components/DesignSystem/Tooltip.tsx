import React, { useState, useRef, useEffect } from 'react';

export interface TooltipProps {
  children: React.ReactNode;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({
  children,
  content,
  position = 'top',
  delay = 200,
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const showTooltip = () => {
    const id = setTimeout(() => setIsVisible(true), delay);
    setTimeoutId(id);
  };

  const hideTooltip = () => {
    if (timeoutId) clearTimeout(timeoutId);
    setIsVisible(false);
  };

  const positionStyles = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  const arrowStyles = {
    top: 'bottom-[-4px] left-1/2 -translate-x-1/2 border-l-[#1A1A1A] border-r-[#1A1A1A] border-b-[#1A1A1A] border-t-transparent',
    bottom: 'top-[-4px] left-1/2 -translate-x-1/2 border-l-[#1A1A1A] border-r-[#1A1A1A] border-t-[#1A1A1A] border-b-transparent',
    left: 'right-[-4px] top-1/2 -translate-y-1/2 border-t-[#1A1A1A] border-b-[#1A1A1A] border-r-[#1A1A1A] border-l-transparent',
    right: 'left-[-4px] top-1/2 -translate-y-1/2 border-t-[#1A1A1A] border-b-[#1A1A1A] border-l-[#1A1A1A] border-r-transparent',
  };

  return (
    <div
      ref={triggerRef}
      className="relative inline-block"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {children}
      
      {isVisible && (
        <div
          ref={tooltipRef}
          className={`absolute z-50 px-3 py-1.5 bg-[#1A1A1A] text-white text-xs rounded-lg shadow-xl whitespace-nowrap ${positionStyles[position]} ${className}`}
          role="tooltip"
        >
          {content}
          <div
            className={`absolute w-2 h-2 border-4 ${arrowStyles[position]}`}
          />
        </div>
      )}
    </div>
  );
};
