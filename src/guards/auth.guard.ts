import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { IS_PUBLIC } from 'src/decorators/public.decorator';
import { verifyToken } from 'src/utils/token.service';
import { connection } from 'src/database/database.module';
import { User } from 'src/database/entities/user.entity';
@Injectable()
export class AuthGuard implements CanActivate {
  private userRepo = connection.manager.getRepository(User);

  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }
    if (context.getType() === 'ws') {
      return this.handleWebSocket(context);
    }

    if (GqlExecutionContext.create(context)) {
      return this.handleGraphQL(context);
    }

    return false;
  }

  private async handleGraphQL(context: ExecutionContext) {
    const gqlContext = GqlExecutionContext.create(context);
    const request = gqlContext.getContext().req;
    const token = request.headers['authorization'].replace('Bearer ', '');
    return this.validateToken(token, request);
  }

  private async handleWebSocket(context: ExecutionContext) {
    const client = context.switchToWs().getClient();
    const token = client.handshake?.headers?.authorization?.replace(
      'Bearer ',
      '',
    );
    return this.validateToken(token, client);
  }

  private async validateToken(token: string, requestOrClient: any) {
    if (!token || !token.trim()) {
      throw new UnauthorizedException('Invalid token');
    }

    const tokenData = await verifyToken(token);
    if (tokenData.error) {
      throw new UnauthorizedException(tokenData.error);
    }

    if (!tokenData.data || !tokenData.data.userId) {
      throw new UnauthorizedException('Invalid token');
    }

    const user = await this.userRepo.findOne({
      where: {
        id: tokenData.data.userId,
        loginHistory: { accessToken: token },
      },
      relations: ['loginHistory'],
    });
    if (!user) {
      throw new ForbiddenException('Access denied');
    }

    requestOrClient.userId = tokenData.data.userId;
    requestOrClient.email = user.email;

    return true;
  }
}
