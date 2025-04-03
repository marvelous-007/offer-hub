import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '@nestjs/cache-manager';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TerminusModule } from '@nestjs/terminus';
import { GatewayController } from './controller';
import { GatewayService } from './service';
import { GatewayLogService } from '../logs/gateway-log.service';

@Module({
  imports: [
    HttpModule,
    TerminusModule,
    CacheModule.register({
      ttl: 60 * 5, // 5 minutes cache time
      max: 100, // maximum cache items
      isGlobal: true,
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'defaultsecret',
        signOptions: { expiresIn: '1h' },
      }),
    }),
  ],
  controllers: [GatewayController],
  providers: [GatewayService, GatewayLogService],
  exports: [GatewayService],
})
export class GatewayModule {} 