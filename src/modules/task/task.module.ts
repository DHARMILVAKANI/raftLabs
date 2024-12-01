import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskResolver } from './task.resolver';
import { RedisService } from 'src/utils/redis.service';

@Module({
  providers: [TaskResolver, TaskService, RedisService],
})
export class TaskModule {}
