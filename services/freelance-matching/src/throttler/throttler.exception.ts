import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * Custom throttler exception with detailed error message
 */
export class ThrottlerException extends HttpException {
  /**
   * Create a new throttler exception
   * @param ttl Time to wait before the next request (in milliseconds)
   * @param limit Maximum number of requests allowed
   */
  constructor(ttl: number, limit: number) {
    const waitSeconds = Math.ceil(ttl / 1000);
    const message = `Rate limit exceeded. You can make ${limit} requests per minute. Please try again in ${waitSeconds} seconds.`;
    
    super(
      {
        statusCode: HttpStatus.TOO_MANY_REQUESTS,
        error: 'Too Many Requests',
        message,
        ttl,
        limit,
      },
      HttpStatus.TOO_MANY_REQUESTS,
    );
  }
}
