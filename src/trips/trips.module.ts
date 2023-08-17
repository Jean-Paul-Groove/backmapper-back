import { Module } from '@nestjs/common';
import { TripsService } from './trips.service';
import { TripsController } from './trips.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Step } from '../steps/entities/step.entity';
import { Trip } from './entities/trip.entity';
import { StepsModule } from 'src/steps/steps.module';

@Module({
  imports: [StepsModule, TypeOrmModule.forFeature([Trip, Step])],
  controllers: [TripsController],
  providers: [TripsService],
})
export class TripsModule {}
