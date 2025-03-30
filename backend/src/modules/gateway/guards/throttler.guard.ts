import { Injectable, ExecutionContext, Logger, HttpException, HttpStatus, CanActivate } from '@nestjs/common';

@Injectable()
export class CustomThrottlerGuard implements CanActivate {
  private readonly logger = new Logger(CustomThrottlerGuard.name);
  private readonly requestMap = new Map<string, { count: number, timestamp: number }>();
  private readonly limit = 5; 
  private readonly ttl = 60000;
  
  private requestCount = 0;

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      this.requestCount++;
      const key = `request_batch_${Math.floor(Date.now() / this.ttl)}`;
      const now = Date.now();
      

      if (!this.requestMap.has(key)) {
        this.requestMap.set(key, { count: 1, timestamp: now });
        this.logger.log(`New rate limiting window started. Request count: 1/${this.limit}`);
        return true;
      }
      
      const data = this.requestMap.get(key);
      if (!data) {
        this.requestMap.set(key, { count: 1, timestamp: now });
        return true;
      }
      
      data.count += 1;
      
      this.logger.log(`Request count: ${data.count}/${this.limit}`);
      
      if (data.count > this.limit) {
        this.logger.warn(`Rate limit exceeded. Current count: ${data.count}/${this.limit}`);
        throw new HttpException('Too Many Requests', HttpStatus.TOO_MANY_REQUESTS);
      }
      
      return true;
    } catch (error) {
      if (error instanceof HttpException && error.getStatus() === HttpStatus.TOO_MANY_REQUESTS) {
        throw error;
      }
      
      this.logger.error(`Error in rate limiter: ${error.message}`);
      return true;
    }
  }
} 