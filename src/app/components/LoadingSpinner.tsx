/**
 * LoadingSpinner Component
 * Reusable loading indicators for the SageÉlan Foundation
 */

import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
  fullScreen?: boolean;
}

export function LoadingSpinner({ message = 'Loading...', fullScreen = true }: LoadingSpinnerProps) {
  if (fullScreen) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sage-50 via-sage-50 to-sage-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 mx-auto mb-4 animate-spin text-sage-600" />
          <p className="text-gray-700">{message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-8">
      <div className="text-center">
        <Loader2 className="w-12 h-12 mx-auto mb-3 animate-spin text-sage-600" />
        <p className="text-gray-600 text-sm">{message}</p>
      </div>
    </div>
  );
}

/**
 * Smaller inline loading spinner for buttons and inline content
 */
export function InlineSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <Loader2 className={`inline-block animate-spin text-sage-600 ${sizeClasses[size]}`} />
  );
}
