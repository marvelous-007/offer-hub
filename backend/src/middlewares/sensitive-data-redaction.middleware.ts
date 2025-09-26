import { Request, Response, NextFunction } from "express";

/**
 * Sensitive Header Redaction Middleware
 * Redacts sensitive headers before logging
 */
export const redactSensitiveHeaders = (req: Request, res: Response, next: NextFunction) => {
  // Create a copy of headers for logging
  const sanitizedHeaders = { ...req.headers };
  
  // List of sensitive headers to redact
  const sensitiveHeaders = [
    'authorization',
    'x-admin-api-key',
    'x-api-key',
    'cookie',
    'x-auth-token',
    'x-access-token',
    'x-webhook-signature',
    'x-stripe-signature',
    'x-github-signature',
    'x-hub-signature',
    'x-hub-signature-256',
  ];

  // Redact sensitive headers
  sensitiveHeaders.forEach(header => {
    const lowerHeader = header.toLowerCase();
    Object.keys(sanitizedHeaders).forEach(key => {
      if (key.toLowerCase() === lowerHeader) {
        sanitizedHeaders[key] = '[REDACTED]';
      }
    });
  });

  // Attach sanitized headers to request for logging
  (req as any).sanitizedHeaders = sanitizedHeaders;
  
  next();
};

/**
 * API Request Logging Middleware with Sensitive Data Redaction
 * Logs API requests while protecting sensitive information
 */
export const apiRequestLoggingMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();
  const requestId = (req as any).requestId || 'unknown';
  
  // Get sanitized headers
  const sanitizedHeaders = (req as any).sanitizedHeaders || req.headers;
  
  // Log request details
  const logEntry = {
    type: 'API_REQUEST',
    requestId,
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url,
    ip: req.ip || req.connection.remoteAddress,
    userAgent: req.get('User-Agent'),
    headers: sanitizedHeaders,
    body: req.method === 'POST' || req.method === 'PUT' ? '[BODY_REDACTED]' : undefined,
  };

  console.log(JSON.stringify(logEntry));

  // Log response details when response finishes
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const responseLogEntry = {
      type: 'API_RESPONSE',
      requestId,
      timestamp: new Date().toISOString(),
      statusCode: res.statusCode,
      duration: `${duration}ms`,
    };

    console.log(JSON.stringify(responseLogEntry));
  });

  next();
};
