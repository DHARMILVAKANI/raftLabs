import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { TaskService } from './task.service';
import { Task } from 'src/database/entities/task.entity';
import { CreateTaskInput } from 'src/modules/task/dto/task.mutaion.dto';
import { CurrentUser } from 'src/decorators/user.decorator';
import { CurrentUserData } from 'src/decorators/interfaces/user.interface';

@Resolver(() => Task)
export class TaskResolver {
  constructor(private readonly taskService: TaskService) {}

  @Mutation(() => Task)
  createTask(
    @Args('CreateTaskInput') data: CreateTaskInput,
    @CurrentUser() userData: CurrentUserData,
  ) {
    return this.taskService.createTask(data, userData.userId);
  }

  @Query(() => [Task])
  getTasks(@CurrentUser() userData: CurrentUserData) {
    return this.taskService.getTasks(userData.userId);
  }

  @Query(() => Task)
  getSingleTasks(
    @Args('id') id: string,
    @CurrentUser() userData: CurrentUserData,
  ) {
    return this.taskService.getSingleTasks(id, userData.userId);
  }

  @Mutation(() => String)
  deleteTask(@Args('id') id: string, @CurrentUser() userData: CurrentUserData) {
    return this.taskService.deleteTask(id, userData.userId);
  }
}
