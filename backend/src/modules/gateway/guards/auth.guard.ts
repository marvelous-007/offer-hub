import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return this.validateRequest(request);
  }

  private async validateRequest(request: any): Promise<boolean> {
    try {
      const authHeader = request.headers.authorization;
      
      if (!authHeader) {
        throw new UnauthorizedException('No authorization token provided');
      }

      if (process.env.NODE_ENV !== 'production') {
        request.user = { 
          id: 'mock-user-id', 
          email: 'dev@example.com',
          roles: ['user']
        };
        return true;
      }

      request.user = { id: 'user-123', roles: ['user'] };
      return true;
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }
} 