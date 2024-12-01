import { Injectable } from '@nestjs/common';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { errorMessages } from 'src/common/error.messages';
import { connection } from 'src/database/database.module';
import { User } from 'src/database/entities/user.entity';
import { IS_PUBLIC } from 'src/decorators/public.decorator';
import { verifyToken } from 'src/utils/token.service';
import { GqlExecutionContext } from '@nestjs/graphql'; // Import for GraphQL

@Injectable()
export class AuthGuard implements CanActivate {
  userRepo = connection.manager.getRepository(User);

  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext) {
    const gqlContext = GqlExecutionContext.create(context); // Create the GraphQL context
    const request = gqlContext.getContext().req; // Get the request object from the GraphQL context

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const Authorization = request.headers['authorization'];
    if (!Authorization) {
      throw new UnauthorizedException(errorMessages.INVALID_TOKEN);
    }

    const token = Authorization.replace('Bearer ', '');
    if (!token || !token.trim()) {
      throw new UnauthorizedException(errorMessages.INVALID_TOKEN);
    }

    const tokenData = await verifyToken(token);
    if (tokenData.error) {
      throw new UnauthorizedException(tokenData.error);
    }

    if (!tokenData.data || !tokenData.data.userId) {
      throw new UnauthorizedException(errorMessages.INVALID_TOKEN);
    }

    const user = await this.userRepo.findOne({
      where: {
        id: tokenData.data.userId,
        loginHistory: { accessToken: token },
      },
      relations: ['loginHistory'],
    });
    if (!user) {
      throw new ForbiddenException();
    }

    request.userId = tokenData.data.userId;
    request.email = user.email;

    return true;
  }
}
