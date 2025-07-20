import React from 'react';

export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="flex items-center space-x-2 text-slate-600">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-slate-900"></div>
        <span>Loading...</span>
      </div>
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="flex items-center space-x-3 text-slate-900">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
        <span className="text-lg font-medium">Loading...</span>
      </div>
    </div>
  );
}
