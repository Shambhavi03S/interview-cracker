import React from 'react';

export function Loading({ message = 'Loading...' }) {
  return (
    <div className="flex items-center justify-center space-x-2">
      <div className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce"></div>
      <div className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      <div className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
      <span className="text-gray-600 ml-3">{message}</span>
    </div>
  );
}

export function ErrorAlert({ error, onDismiss }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-sm font-semibold text-red-800">Error</h3>
          <p className="text-sm text-red-700 mt-1">
            {error?.data?.message || error?.message || 'An error occurred'}
          </p>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-red-600 hover:text-red-800 text-lg font-bold"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}
