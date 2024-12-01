import { Repository } from 'typeorm';
import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateTaskInput } from 'src/modules/task/dto/task.mutaion.dto';
import { Task } from 'src/database/entities/task.entity';
import { connection } from 'src/database/database.module';
import { errorMessages } from 'src/common/error.messages';

@Injectable()
export class TaskService {
  taskRepo: Repository<Task>;
  constructor() {
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
    return task;
  }

  async getTasks(userId: string) {
    const tasks = await this.taskRepo.find({ where: { user: { id: userId } } });
    if (!tasks) return [];
    return tasks;
  }

  async getSingleTasks(taskId: string, userId: string) {
    const task = await this.taskRepo.findOne({
      where: { id: taskId, user: { id: userId } },
    });
    if (!task) throw new BadRequestException(errorMessages.notFound('Task'));
    return task;
  }

  async deleteTask(taskId: string, userId: string) {
    console.log(taskId, userId);
    await this.taskRepo.softDelete({ id: taskId, user: { id: userId } });
    return 'Task deleted successfully';
  }
}
