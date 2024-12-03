import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TripsModule } from './trips/trips.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Trip } from './trips/entities/trip.entity';
import { Step } from './steps/entities/step.entity';
import { AuthModule } from './auth/auth.module';
import { StepsModule } from './steps/steps.module';
import { User } from './auth/entities/user.entity';
import generalConfig from './configuration/general.config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      load: [generalConfig],
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT as number,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [Trip, Step, User],
      synchronize: true,
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRATION },
    }),
    TripsModule,
    AuthModule,
    StepsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
