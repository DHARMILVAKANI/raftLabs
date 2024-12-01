import { Repository } from 'typeorm';
import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateTaskInput } from 'src/modules/task/dto/task.mutaion.dto';
import { Task } from 'src/database/entities/task.entity';
import { connection } from 'src/database/database.module';
import { errorMessages } from 'src/common/error.messages';
import { RedisService } from 'src/utils/redis.service';

@Injectable()
export class TaskService {
  taskRepo: Repository<Task>;
  constructor(private redisService: RedisService) {
    this.taskRepo = connection.getRepository(Task);
  }
  async createTask(data: CreateTaskInput, userId: string) {
    const { title, description } = data;
    const task = await this.taskRepo.save({
      title,
      description,
      createdBy: userId,
      user: { id: userId },
    });
    await this.redisService.set(`task:${userId}:${task.id}`, task, 600);
    await this.redisService.delete(`tasks:${userId}`);
    return task;
  }

  async getTasks(userId: string) {
    const tasksFromCache = await this.redisService.get(`tasks:${userId}`);

    if (tasksFromCache) {
      console.log('Recieved from cache', tasksFromCache);
      return tasksFromCache;
    }
    const tasks = await this.taskRepo.find({ where: { user: { id: userId } } });
    if (!tasks) return [];
    if (tasks.length) {
      await this.redisService.set(`tasks:${userId}`, tasks, 800);
    }
    return tasks;
  }

  async getSingleTasks(taskId: string, userId: string) {
    const taskFromCache = await this.redisService.get(
      `task:${userId}:${taskId}`,
    );

    if (taskFromCache) {
      console.log('Recieved from cache', taskFromCache);
      return taskFromCache;
    }
    const task = await this.taskRepo.findOne({
      where: { id: taskId, user: { id: userId } },
    });
    if (!task) throw new BadRequestException(errorMessages.notFound('Task'));
    await this.redisService.set(`task:${userId}:${taskId}`, task, 600);
    return task;
  }

  async deleteTask(taskId: string, userId: string) {
    await this.taskRepo.softDelete({ id: taskId, user: { id: userId } });
    await this.redisService.delete(`task:${userId}:${taskId}`);
    await this.redisService.delete(`tasks:${userId}`);
    return 'Task deleted successfully';
  }
}
