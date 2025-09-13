
import React from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Logo: React.FC<LogoProps> = ({ className, size = 'md' }) => {
  const sizeClasses = {
    sm: 'h-8 w-auto',
    md: 'h-12 w-auto',
    lg: 'h-16 w-auto',
    xl: 'h-20 w-auto'
  };

  return (
    <img 
      src="/a6e4e070-ffc3-4804-b863-095bf5130e3d.png" 
      alt="AMC College Logo" 
      className={cn(
        'object-contain opacity-90 hover:opacity-100 transition-opacity duration-200',
        sizeClasses[size],
        className
      )}
    />
  );
};
