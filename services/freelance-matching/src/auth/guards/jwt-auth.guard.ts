import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { GqlExecutionContext } from '@nestjs/graphql';

/**
 * JWT Authentication Guard
 * @description Protects routes and GraphQL resolvers with JWT authentication
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  /**
   * Determines if the current request is allowed to proceed
   * @param context The execution context
   * @returns Whether the request is allowed
   */
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // Check if the endpoint is public (no auth required)
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    // Proceed with JWT validation
    return super.canActivate(context);
  }

  /**
   * Handle unauthorized requests
   * @param err The error that occurred
   * @param info Additional information about the error
   * @returns Never - throws an UnauthorizedException
   */
  handleRequest(err: any, user: any, info: any): any {
    // Handle JWT validation errors
    if (err || !user) {
      let message = 'Unauthorized access';
      
      if (info instanceof Error) {
        if (info.name === 'TokenExpiredError') {
          message = 'Token has expired';
        } else if (info.name === 'JsonWebTokenError') {
          message = 'Invalid token';
        }
      }
      
      throw new UnauthorizedException(message);
    }
    
    return user;
  }

  /**
   * Get the request object from the execution context
   * @param context The execution context
   * @returns The request object
   */
  getRequest(context: ExecutionContext) {
    // Support both HTTP and GraphQL contexts
    if (context.getType() === 'http') {
      return context.switchToHttp().getRequest();
    } else if (context.getType<string>() === 'graphql') {
      const ctx = GqlExecutionContext.create(context);
      return ctx.getContext().req;
    }
    
    return context.switchToHttp().getRequest();
  }
}
