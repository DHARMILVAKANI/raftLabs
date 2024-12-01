import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UserService } from './user.service';
import { UpdateProfileInput } from './dto/user.mutation.dto';
import { User } from 'src/database/entities/user.entity';
import { CurrentUserData } from 'src/decorators/interfaces/user.interface';
import { CurrentUser } from 'src/decorators/user.decorator';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => User)
  updateProfile(
    @Args('updateProfileInput') data: UpdateProfileInput,
    @CurrentUser() userData: CurrentUserData,
  ) {
    return this.userService.updateProfile(userData.userId, data);
  }

  @Query(() => User)
  getProfileData(@CurrentUser() userData: CurrentUserData) {
    return this.userService.getProfileData(userData.userId);
  }
}
