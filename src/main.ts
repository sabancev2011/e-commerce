import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser'
import { setupSwagger } from './swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  setupSwagger(app)
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());
  await app.listen(8000);
}
bootstrap();
