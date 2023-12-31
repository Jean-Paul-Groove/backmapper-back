import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors();
  app.useStaticAssets(join(__dirname, '..', 'step-pictures'), {
    prefix: '/api/step-pictures/',
  });
  console.log(process.env.PORT);
  await app.listen(process.env.PORT);
}
bootstrap();
