import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  console.log({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT as number,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: ['Trip', 'Step', 'User'],
    synchronize: true,
  });
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors();
  app.useStaticAssets(join(__dirname, '..', 'step-pictures'), {
    prefix: '/api/step-pictures/',
  });
  console.log(process.env.PORT);
  console.log(join(__dirname, '..', 'step-pictures'));
  await app.listen(process.env.PORT);
}
bootstrap();
