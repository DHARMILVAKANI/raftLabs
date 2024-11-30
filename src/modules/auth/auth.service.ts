import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  LoginInput,
  LoginResponse,
  SignUpInput,
  SignUpRespone,
} from './dto/signup.dto';
import { Repository } from 'typeorm';
import { User } from '../../database/entities/user.entity';
import { connection } from '../../database/database.module';
import { errorMessages } from '../../common/error.messages';
import { compare, createHash } from '../../utils/hash';
import { createToken } from '../../utils/token.service';
import { ITokenPayload } from '../../common/interfaces/token.payload.interface';
import { UserLoginHistory } from '../../database/entities/login.history.entity';

@Injectable()
export class AuthService {
  userRepo: Repository<User>;
  userLogin: Repository<UserLoginHistory>;
  constructor() {
    this.userRepo = connection.getRepository(User);
    this.userLogin = connection.getRepository(UserLoginHistory);
  }
  async signUp(data: SignUpInput): Promise<SignUpRespone> {
    const { email, firstName, lastName, password } = data;
    const isUserExist = await this.userRepo.findOne({ where: { email } });
    if (isUserExist)
      throw new BadRequestException(errorMessages.EMAIL_ALREADY_EXIST);
    try {
      const { hash } = createHash(password, true);
      const user = await this.userRepo.save({
        email,
        firstName,
        lastName,
        password: hash,
      });
      const payload: ITokenPayload = {
        userId: user.id,
        email: user.email,
      };
      const { accessToken } = createToken(payload, true);
      await this.userLogin.save({ accessToken, user });

      // We can implement send email functionality here if we want

      return { ...user, accessToken };
    } catch (error) {
      throw new InternalServerErrorException(
        errorMessages.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async login(data: LoginInput): Promise<LoginResponse> {
    const { email, password } = data;
    const user = await this.userRepo.findOne({
      where: { email },
      relations: ['loginHistory'],
      select: { loginHistory: { id: true, accessToken: true } },
    });
    if (!user || !compare(password, user.password))
      throw new BadRequestException(errorMessages.INVALID_INPUT);

    try {
      const payload: ITokenPayload = {
        userId: user.id,
        email: user.email,
      };
      const { accessToken } = createToken(payload, true);
      await this.userLogin.update(
        { id: user.loginHistory.id, user: { id: user.id } },
        { accessToken },
      );
      return { accessToken, email, id: user.id };
    } catch (error) {
      throw new InternalServerErrorException(
        errorMessages.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
