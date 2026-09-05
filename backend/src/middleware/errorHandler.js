/**
 * Global error handling middleware
 * Catches all errors and returns a consistent error response
 */
export function errorHandler(err, req, res, next) {
  console.error('Error:', err.message);

  // Anthropic API errors
  if (err.status === 401) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid or missing API key. Check ANTHROPIC_API_KEY in .env',
    });
  }

  if (err.status === 429) {
    return res.status(429).json({
      error: 'Rate Limited',
      message: 'Too many requests to Claude API. Please try again later.',
    });
  }

  if (err.status >= 500) {
    return res.status(503).json({
      error: 'Service Unavailable',
      message: 'Claude API is temporarily unavailable. Please try again later.',
    });
  }

  // Validation and parsing errors
  if (err instanceof SyntaxError && err.status === 400) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'Invalid JSON in request body',
    });
  }

  // Default error response
  res.status(err.status || 500).json({
    error: err.error || 'Internal Server Error',
    message: err.message || 'An unexpected error occurred',
  });
}

/**
 * Request validation middleware
 */
export function validateJSON(req, res, next) {
  if (req.is('json')) {
    next();
  } else if (req.method === 'POST' || req.method === 'PUT') {
    res.status(400).json({
      error: 'Bad Request',
      message: 'Content-Type must be application/json',
    });
  } else {
    next();
  }
}
