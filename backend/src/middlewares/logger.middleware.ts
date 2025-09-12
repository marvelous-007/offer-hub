import { Request, Response, NextFunction } from 'express';
import winston from 'winston';
import { v4 as uuidv4 } from 'uuid';

// Create logger instance with secure configuration
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.colorize({ all: process.env.NODE_ENV !== 'production' }),
    winston.format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ 
      filename: 'logs/app.log',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    })
  ]
});

// Sanitize sensitive data from objects
const sanitizeData = (data: any): any => {
  if (!data || typeof data !== 'object') return data;
  
  const sensitive = ['password', 'token', 'authorization', 'cookie', 'api_key', 'secret'];
  const sanitized = { ...data };
  
  for (const key in sanitized) {
    if (sensitive.some(s => key.toLowerCase().includes(s))) {
      sanitized[key] = '[REDACTED]';
    } else if (typeof sanitized[key] === 'object') {
      sanitized[key] = sanitizeData(sanitized[key]);
    }
  }
  
  return sanitized;
};

// Get user ID safely from authenticated request
const getUserId = (req: Request): string => {
  try {
    return (req as any).user?.id || 'anonymous';
  } catch {
    return 'anonymous';
  }
};

// Calculate request body size safely
const getBodySize = (body: any): number => {
  if (!body) return 0;
  try {
    return JSON.stringify(sanitizeData(body)).length;
  } catch {
    return 0;
  }
};

export const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const startTime = process.hrtime.bigint();
  const requestId = (req.headers['x-request-id'] as string) || uuidv4();
  
  // Set request ID for tracking
  res.setHeader('x-request-id', requestId);
  
  // Capture request data
  const method = req.method;
  const url = req.originalUrl || req.url;
  const userAgent = req.headers['user-agent'] || 'unknown';
  const contentType = req.headers['content-type'] || 'none';
  const userId = getUserId(req);
  const bodySize = ['POST', 'PUT', 'PATCH'].includes(method) ? getBodySize(req.body) : 0;
  
  // Log incoming request
  logger.info(`${method} ${url} - User: ${userId} - Size: ${bodySize} bytes - UA: ${userAgent} - CT: ${contentType}`);
  
  // Override res.end to capture response
  const originalEnd = res.end.bind(res);
  res.end = function(...args: any[]) {
    const endTime = process.hrtime.bigint();
    const responseTime = Number(endTime - startTime) / 1000000; // Convert to milliseconds
    const statusCode = res.statusCode;
    
    // Log response with appropriate level
    const logMessage = `${method} ${url} - ${statusCode} - ${Math.round(responseTime)}ms - User: ${userId}`;
    
    if (statusCode >= 500) {
      logger.error(`${logMessage} - Error: Server error`);
    } else if (statusCode >= 400) {
      logger.warn(`${logMessage} - Error: Client error`);
    } else {
      logger.info(logMessage);
    }
    
    // Call original end method with proper return
    return originalEnd(...args);
  } as any;
  
  next();
};