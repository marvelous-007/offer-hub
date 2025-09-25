import { ExecutionContext, Injectable } from '@nestjs/common';
import { ThrottlerGuard as NestThrottlerGuard } from '@nestjs/throttler';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ThrottlerException } from './throttler.exception';

@Injectable()
export class ThrottlerGuard extends NestThrottlerGuard {
  /**
   * Extract the request IP address
   * @param context The execution context
   * @returns The IP address
   */
  protected getIp(context: ExecutionContext): string {
    let request: any;
    
    if (context.getType() === 'http') {
      request = context.switchToHttp().getRequest();
    } else if (context.getType<string>() === 'graphql') {
      const gqlContext = GqlExecutionContext.create(context);
      request = gqlContext.getContext().req;
    } else {
      request = context.switchToHttp().getRequest();
    }
    
    // Get IP from X-Forwarded-For header or fallback to connection remote address
    return (
      request.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
      request.ip ||
      request.connection?.remoteAddress ||
      'unknown'
    );
  }

  /**
   * Get the request object from the execution context
   * @param context The execution context
   * @returns The request object
   */
  protected getRequestResponse(context: ExecutionContext) {
    if (context.getType() === 'http') {
      return {
        req: context.switchToHttp().getRequest(),
        res: context.switchToHttp().getResponse(),
      };
    }
    
    if (context.getType<string>() === 'graphql') {
      const gqlContext = GqlExecutionContext.create(context);
      const ctx = gqlContext.getContext();
      
      return { req: ctx.req, res: ctx.res };
    }
    
    return {
      req: context.switchToHttp().getRequest(),
      res: context.switchToHttp().getResponse(),
    };
  }

  /**
   * Get the throttler name based on the request type
   * @param context The execution context
   * @returns The throttler name
   */
  protected getTrackerName(context: ExecutionContext): string {
    if (context.getType<string>() === 'graphql') {
      return 'graphql';
    }
    return 'default';
  }

  /**
   * Throw a custom throttler exception when rate limit is exceeded
   * @param ttl The time to wait before the next request
   * @param limit The maximum number of requests allowed
   */
  protected throwThrottlingException(ttl: number, limit: number): void {
    throw new ThrottlerException(ttl, limit);
  }
}
