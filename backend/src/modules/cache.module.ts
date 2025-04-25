import { Module } from '@nestjs/common';
import { CacheModule as NestCacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';
import { CacheService } from './cache/cache.service';

@Module({
  imports: [
    NestCacheModule.registerAsync({
      useFactory: async () => ({
        store: await redisStore({
          socket: {
            host: 'localhost',
            port: 6379,
          },
          ttl: 600, 
        }),
      }),
    }),
  ],
  providers: [CacheService],
  exports: [CacheService],
})
export class CustomCacheModule {} 
