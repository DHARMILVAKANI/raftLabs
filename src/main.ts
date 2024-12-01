import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { envConfig } from './config/env.config';
import { Logger, ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { GqlExceptionFilter } from 'src/dispatchers/exception.filter';

async function bootstrap() {
  const logger = new Logger();
  const app = await NestFactory.create(AppModule);
  const appPort = envConfig.app.port;

  app.use(helmet.frameguard());
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new GqlExceptionFilter());
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  await app.listen(appPort);
  logger.log(`🚀 Application running on port ${appPort}`);
}
bootstrap();
