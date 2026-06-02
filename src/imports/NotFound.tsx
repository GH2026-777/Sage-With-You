/**
 * 404 Not Found Page - Reusable Version
 * 
 * DEPENDENCIES:
 * - lucide-react (for Home icon)
 * - Optional: Your logo component
 * 
 * USAGE:
 * import { NotFound } from './NotFound';
 * 
 * <NotFound onHomeClick={() => navigate('/')} />
 * 
 * FEATURES:
 * - Clean, branded 404 page
 * - Return home button
 * - Gradient background
 * - Responsive design
 * 
 * CUSTOMIZATION:
 * - Replace gradient colors with your brand colors
 * - Replace button color
 * - Add your logo at the top
 * - Customize message text
 * - Add additional navigation options
 * 
 * EXTRACTION TIME: 2 minutes
 */

import React from 'react';
import { Home } from 'lucide-react';

interface NotFoundProps {
  onHomeClick: () => void;
}

export function NotFound({ onHomeClick }: NotFoundProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 to-purple-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Replace this with your logo component */}
        <div className="mb-8">
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#4169E1' }}>
            Your Logo Here
          </h1>
        </div>
        
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Page Not Found</h2>
          <p className="text-gray-600 mb-8">
            Oops! The page you're looking for doesn't exist. Let's get you back on track.
          </p>
          
          <button
            onClick={onHomeClick}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-white font-medium transition-all hover:opacity-90"
            style={{ backgroundColor: '#4169E1' }}
          >
            <Home className="w-5 h-5" />
            Return Home
          </button>
        </div>
      </div>
    </div>
  );
}
