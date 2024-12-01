import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdateProfileInput } from './dto/user.mutation.dto';
import { connection } from 'src/database/database.module';
import { User } from 'src/database/entities/user.entity';
import { Repository } from 'typeorm';
import { UserLoginHistory } from 'src/database/entities/login.history.entity';
import { errorMessages } from 'src/common/error.messages';

@Injectable()
export class UserService {
  userRepo: Repository<User>;
  userLogin: Repository<UserLoginHistory>;
  constructor() {
    this.userRepo = connection.getRepository(User);
    this.userLogin = connection.getRepository(UserLoginHistory);
  }
  async updateProfile(userId: string, data: UpdateProfileInput) {
    const { dob, firstName, lastName, phoneNumber } = data;
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new BadRequestException(errorMessages.notFound('User'));

    user.dob = dob ?? user.dob;
    user.firstName = firstName ?? user.firstName;
    user.lastName = lastName ?? user.lastName;
    user.phoneNumber = phoneNumber ?? user.phoneNumber;

    const updatedUser = await this.userRepo.save(user);

    return updatedUser;
  }

  async getProfileData(userId: string) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new BadRequestException(errorMessages.notFound('User'));

    return user;
  }
}
