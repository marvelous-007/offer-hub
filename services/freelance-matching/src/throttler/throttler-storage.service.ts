import { Injectable } from '@nestjs/common';
import { ThrottlerModuleOptions, ThrottlerStorage } from '@nestjs/throttler';
import { ModuleRef } from '@nestjs/core';

/**
 * Service to interact with the throttler storage
 */
@Injectable()
export class ThrottlerStorageService {
  private storage: ThrottlerStorage;

  constructor(private moduleRef: ModuleRef) {
    // Get the throttler options to access the storage
    setTimeout(() => {
      const options = this.moduleRef.get(ThrottlerModuleOptions, { strict: false });
      this.storage = options.storage;
    }, 0);
  }

  /**
   * Get the current rate limit status for a specific key
   * @param key The throttler key
   * @returns The current rate limit status or null if not found
   */
  async getRateLimit(key: string): Promise<{ totalHits: number; timeToExpire: number } | null> {
    if (!this.storage) {
      return null;
    }

    try {
      const record = await this.storage.getRecord(key);
      if (!record) {
        return null;
      }

      return {
        totalHits: record.totalHits,
        timeToExpire: record.expiresAt - Date.now(),
      };
    } catch (error) {
      return null;
    }
  }

  /**
   * Clear the rate limit for a specific key
   * @param key The throttler key
   * @returns Whether the operation was successful
   */
  async clearRateLimit(key: string): Promise<boolean> {
    if (!this.storage) {
      return false;
    }

    try {
      await this.storage.deleteRecord(key);
      return true;
    } catch (error) {
      return false;
    }
  }
}
