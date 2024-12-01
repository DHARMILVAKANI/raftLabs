import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApolloError } from 'apollo-server-express';
import { logger } from 'src/utils/service-logger';
import { errorMessages } from '../common/error.messages';
import { GqlArgumentsHost } from '@nestjs/graphql';

@Catch()
export class GqlExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    logger.error('Exception caught in GqlExceptionFilter', exception);
    const gqlHost = GqlArgumentsHost.create(host);
    if (gqlHost) {
      let status = HttpStatus.INTERNAL_SERVER_ERROR;
      let message = errorMessages.INTERNAL_SERVER_ERROR;

      if (exception instanceof HttpException) {
        status = exception.getStatus();
        message = exception.getResponse()?.['message'] || exception.message;
      } else if (exception instanceof ApolloError) {
        message = exception.message;
      }
      if (status === HttpStatus.FORBIDDEN) {
        message = errorMessages.SESSION_EXPIRED;
      }

      return new ApolloError(message, `${status}`);
    }
  }
}
