import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { RedisService } from 'src/utils/redis.service';

@Module({
  providers: [AuthResolver, AuthService, RedisService],
})
export class AuthModule {}
