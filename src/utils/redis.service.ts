import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { envConfig } from 'src/config/env.config';

@Injectable()
export class RedisService {
  private client: Redis;

  constructor() {
    this.client = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(envConfig.app.redis.port, 10) || 6379,
    });

    this.client.on('connect', () => console.log('Redis connected.'));
    this.client.on('error', (err) => console.error('Redis error:', err));
  }

  async set(key: string, value: any, ttl?: number): Promise<void> {
    try {
      const serializedValue = JSON.stringify(value);
      if (ttl) {
        await this.client.set(key, serializedValue, 'EX', ttl);
      } else {
        await this.client.set(key, serializedValue);
      }
    } catch (error) {
      console.error('Error setting value in Redis:', error);
    }
  }

  async get(key: string) {
    try {
      const value = await this.client.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Error getting value from Redis:', error);
      return null;
    }
  }

  async delete(key: string) {
    try {
      await this.client.del(key);
    } catch (error) {
      console.error('Error deleting value from Redis:', error);
    }
  }

  async increment(key: string, increment: number) {
    try {
      return await this.client.incrby(key, increment);
    } catch (error) {
      console.error('Error incrementing value in Redis:', error);
      return 0;
    }
  }
}
