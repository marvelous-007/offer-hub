import {
  Controller,
  All,
  Req,
  Res,
  HttpStatus,
  Headers,
  Body,
  HttpException,
  UseGuards,
  Get,
  Post,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { HealthCheck, HealthCheckService, HttpHealthIndicator } from '@nestjs/terminus';
import { GatewayService } from './service';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from './guards/auth.guard';

@Controller()
export class GatewayController {
  constructor(
    private readonly gatewayService: GatewayService,
    private readonly configService: ConfigService,
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
  ) {}

  // Health check endpoint
  @Get('health')
  @HealthCheck()
  async check() {
    const hasuraUrl = this.configService.get<string>('HASURA_URL') || 'http://offer_hub_hasura:8080/v1/graphql';
    return this.health.check([
      async () => this.http.pingCheck('hasura', hasuraUrl),
    ]);
  }

  // GraphQL endpoint - route to Hasura
  @All('graphql')
  async graphqlProxy(
    @Req() req: Request,
    @Res() res: Response,
    @Headers('authorization') authorization: string,
  ) {
    try {
      if (!authorization) {
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      }
      
      const result = await this.gatewayService.forwardToHasura(req, authorization);
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      return res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message || 'Internal Server Error',
      });
    }
  }

  // Authentication routes
  @All('auth/*')
  async authProxy(@Req() req: Request, @Res() res: Response) {
    try {
      // Extract path parameters
      req.url = req.url.replace('/auth', '');
      
      const result = await this.gatewayService.forwardToAuth(req);
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      return res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message || 'Internal Server Error',
      });
    }
  }

  // Special test payments endpoint
  @Post('payments/create')
  async createPayment(
    @Body() body: any,
    @Headers('authorization') authorization: string,
    @Res() res: Response
  ) {
    try {
      if (!authorization) {
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      }
      
      // Create a mock request object
      const mockRequest = {
        url: '/create',
        method: 'POST',
        body: body,
        headers: { authorization }
      };
      
      const result = await this.gatewayService.forwardToPayments(mockRequest, authorization);
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      return res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message || 'Internal Server Error',
      });
    }
  }

  // Payment routes - secured with authentication
  @All('payments/*')
  @UseGuards(AuthGuard)
  async paymentsProxy(
    @Req() req: Request,
    @Res() res: Response,
    @Headers('authorization') authorization: string,
  ) {
    try {
      if (!authorization) {
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      }
      
      // Extract path parameters
      req.url = req.url.replace('/payments', '');
      
      const result = await this.gatewayService.forwardToPayments(req, authorization);
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      return res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message || 'Internal Server Error',
      });
    }
  }

  // Cache invalidation endpoint
  @All('cache/invalidate')
  @UseGuards(AuthGuard)
  async invalidateCache(@Body() body: { pattern: string }, @Res() res: Response) {
    try {
      if (!body.pattern) {
        throw new HttpException('Pattern is required', HttpStatus.BAD_REQUEST);
      }
      
      await this.gatewayService.invalidateCache(body.pattern);
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: `Cache invalidated for pattern: ${body.pattern}`,
      });
    } catch (error) {
      return res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message || 'Internal Server Error',
      });
    }
  }
} 