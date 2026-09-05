import React from 'react';

/** Small caption used above a block of content, e.g. "Question 3". */
export function Label({ children, className = '' }) {
  return (
    <p className={`text-sm font-medium text-ink-faint ${className}`}>{children}</p>
  );
}

/** Primary call-to-action button. */
export function Button({ children, variant = 'primary', className = '', ...props }) {
  const base = 'inline-flex items-center justify-center gap-2 rounded-md px-6 py-3 font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50';
  const variants = {
    primary: 'bg-ink text-paper hover:bg-ink/90',
    secondary: 'bg-white text-ink border border-line hover:border-ink/40',
    quiet: 'text-ink-soft hover:text-ink',
  };
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}

export function Loading({ message = 'Loading…' }) {
  return (
    <div className="flex items-center justify-center gap-2">
      <span className="w-1.5 h-1.5 bg-brass-500 rounded-full animate-bounce" />
      <span className="w-1.5 h-1.5 bg-brass-500 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
      <span className="w-1.5 h-1.5 bg-brass-500 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
      <span className="text-ink-soft ml-2 text-sm">{message}</span>
    </div>
  );
}

export function ErrorAlert({ error, onDismiss }) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-md border border-clay-600/30 bg-clay-50 px-4 py-3 mb-4">
      <div>
        <p className="text-sm font-semibold text-clay-700">Something went wrong</p>
        <p className="text-sm text-clay-700/90 mt-0.5">
          {error?.data?.message || error?.message || 'Please try again.'}
        </p>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          aria-label="Dismiss"
          className="text-clay-600 hover:text-clay-700 text-lg leading-none"
        >
          ×
        </button>
      )}
    </div>
  );
}
