import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { envConfig } from './config/env.config';
import { Logger, ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';

async function bootstrap() {
  const logger = new Logger();
  const app = await NestFactory.create(AppModule);
  const appPort = envConfig.app.port;

  app.use(helmet.frameguard());
  app.setGlobalPrefix('/api');
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(appPort);
  logger.log(`🚀 Application running on port ${appPort}`);
}
bootstrap();
