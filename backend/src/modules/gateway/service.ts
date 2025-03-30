import { Injectable, Logger, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { catchError, firstValueFrom, map } from 'rxjs';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { GatewayLogService } from '../logs/gateway-log.service';

@Injectable()
export class GatewayService {
  private readonly logger = new Logger(GatewayService.name);
  private readonly hasuraEndpoint: string;
  private readonly authEndpoint: string;
  private readonly paymentsEndpoint: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly gatewayLogService: GatewayLogService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {
    // Get service endpoints from environment or use defaults
    this.hasuraEndpoint = process.env.NODE_ENV !== 'production' 
      ? 'http://localhost:8080/v1/graphql'
      : this.configService.get<string>('HASURA_URL') || 'http://offer_hub_hasura:8080/v1/graphql';
    this.authEndpoint = this.configService.get<string>('AUTH_SERVICE_URL') || 'http://localhost:3001/auth';
    this.paymentsEndpoint = this.configService.get<string>('PAYMENTS_SERVICE_URL') || 'http://localhost:3001/payments';
  }

  async validateToken(token: string): Promise<any> {
    try {
      // In development mode, accept any token
      if (process.env.NODE_ENV !== 'production') {
        this.logger.log('Development mode: Accepting any token');
        return { 
          id: 'test-user',
          roles: ['user', 'admin']
        };
      }
      
      const decoded = this.jwtService.verify(token.replace('Bearer ', ''));
      return decoded;
    } catch (error) {
      this.logger.error(`Token validation failed: ${error.message}`);
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
  }

  async forwardToHasura(request: any, token: string): Promise<any> {
    const cacheKey = `hasura:${JSON.stringify(request.body)}`;
    
    // Try to get data from cache first
    const cachedData = await this.cacheManager.get(cacheKey);
    if (cachedData) {
      this.logger.log('Returning cached GraphQL response');
      return cachedData;
    }

    try {
      // Log the incoming request
      await this.gatewayLogService.logApiRequest({
        path: 'graphql',
        method: request.method,
        userId: request.user?.id || 'anonymous',
        requestBody: JSON.stringify(request.body),
        timestamp: new Date(),
      });

      // Forward request to Hasura
      const response = await firstValueFrom(
        this.httpService
          .post(this.hasuraEndpoint, request.body, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': token,
              'x-hasura-admin-secret': this.configService.get<string>('HASURA_GRAPHQL_ADMIN_SECRET') || 'offerhub_secret',
            },
          })
          .pipe(
            map((response) => response.data),
            catchError((error) => {
              this.logger.error(`Error forwarding to Hasura: ${error.message}`);
              throw new HttpException(
                error.response?.data || 'Error forwarding request to Hasura',
                error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
              );
            }),
          ),
      );

      // Cache the response
      await this.cacheManager.set(cacheKey, response);
      
      // Log the successful response
      await this.gatewayLogService.logApiResponse({
        path: 'graphql',
        statusCode: HttpStatus.OK,
        responseBody: JSON.stringify(response),
        timestamp: new Date(),
      });

      return response;
    } catch (error) {
      // Log the error
      await this.gatewayLogService.logApiError({
        path: 'graphql',
        statusCode: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
        errorMessage: error.message,
        timestamp: new Date(),
      });
      
      throw error;
    }
  }

  async forwardToAuth(request: any): Promise<any> {
    try {
      // Log the incoming request
      await this.gatewayLogService.logApiRequest({
        path: `auth${request.url}`,
        method: request.method,
        userId: request.user?.id || 'anonymous',
        requestBody: JSON.stringify(request.body),
        timestamp: new Date(),
      });

      // Forward request to Auth service
      const response = await firstValueFrom(
        this.httpService
          .request({
            method: request.method,
            url: `${this.authEndpoint}${request.url}`,
            data: request.body,
            headers: {
              'Content-Type': 'application/json',
              ...request.headers,
            },
          })
          .pipe(
            map((response) => response.data),
            catchError((error) => {
              this.logger.error(`Error forwarding to Auth service: ${error.message}`);
              throw new HttpException(
                error.response?.data || 'Error forwarding request to Auth service',
                error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
              );
            }),
          ),
      );

      // Log the successful response
      await this.gatewayLogService.logApiResponse({
        path: `auth${request.url}`,
        statusCode: HttpStatus.OK,
        responseBody: JSON.stringify(response),
        timestamp: new Date(),
      });

      return response;
    } catch (error) {
      // Log the error
      await this.gatewayLogService.logApiError({
        path: `auth${request.url}`,
        statusCode: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
        errorMessage: error.message,
        timestamp: new Date(),
      });
      
      throw error;
    }
  }

  async forwardToPayments(request: any, token: string): Promise<any> {
    try {
      // Validate token before forwarding to payments
      await this.validateToken(token);

      // Log the incoming request
      await this.gatewayLogService.logApiRequest({
        path: `payments${request.url}`,
        method: request.method,
        userId: request.user?.id || 'anonymous',
        requestBody: JSON.stringify(request.body),
        timestamp: new Date(),
      });

      // For testing purposes, return a mock response instead of forwarding
      // This simulates a successful payment processing
      if (request.url.includes('/create')) {
        const response = {
          success: true,
          payment_id: `pay_${Math.random().toString(36).substring(2, 15)}`,
          amount: request.body.amount,
          currency: request.body.currency,
          status: 'succeeded',
          created: new Date().toISOString()
        };

        // Log the successful response
        await this.gatewayLogService.logApiResponse({
          path: `payments${request.url}`,
          statusCode: HttpStatus.OK,
          responseBody: JSON.stringify(response),
          timestamp: new Date(),
        });

        return response;
      }

      // If not a recognized payment endpoint, return error
      throw new HttpException('Payment endpoint not found', HttpStatus.NOT_FOUND);
    } catch (error) {
      // Log the error
      await this.gatewayLogService.logApiError({
        path: `payments${request.url}`,
        statusCode: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
        errorMessage: error.message,
        timestamp: new Date(),
      });
      
      throw error;
    }
  }

  // Method to clear cache for specific keys
  async invalidateCache(pattern: string): Promise<void> {
    try {
      // In memory cache doesn't support keys enumeration
      // Just delete the specific key if it matches the pattern
      await this.cacheManager.del(pattern);
      this.logger.log(`Invalidated cache for pattern: ${pattern}`);
    } catch (error) {
      this.logger.error(`Failed to invalidate cache: ${error.message}`);
    }
  }
} 