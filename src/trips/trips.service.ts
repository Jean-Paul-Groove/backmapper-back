import { Injectable, Logger } from '@nestjs/common';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Trip } from './entities/trip.entity';
import { Step } from './entities/step.entity';
import { Repository } from 'typeorm';
import { CreateStepDto } from './dto/create-step.dto';

@Injectable()
export class TripsService {
  constructor(
    @InjectRepository(Trip) private readonly tripRepository: Repository<Trip>,
    @InjectRepository(Step) private readonly stepRepository: Repository<Step>,
  ) {}

  async createTrip(createTripDto: CreateTripDto) {
    try {
      Logger.log(createTripDto);
      const trip = new Trip();
      trip.title = createTripDto.title;
      trip.color = createTripDto.color;
      trip.startDate = createTripDto.startDate;
      const tripEntity = this.tripRepository.create(trip);
      await this.tripRepository.save(tripEntity);
      return tripEntity;
    } catch (error) {
      Logger.log(error);
      Logger.log(createTripDto);
    }
  }

  async createStep(
    createStepDto: CreateStepDto,
    tripId: number,
  ): Promise<Step> {
    try {
      const step = new Step();
      step.title = createStepDto.title;
      step.coordinates = createStepDto.coordinates.toString();
      step.date = createStepDto.date;
      step.description = createStepDto.description;
      step.trip = await this.tripRepository.findOne({
        where: { id: tripId },
      });
      const stepEntity = this.stepRepository.create(step);
      await this.stepRepository.save(stepEntity);
      Logger.log('Nouveau step ajouté');
      Logger.log('step = ' + step);
      Logger.log('stepEntity = ' + stepEntity);
      return stepEntity;
    } catch (error) {
      Logger.log(error);
      Logger.log('erreur !!! ' + createStepDto);
    }
  }

  async findAll(): Promise<Trip[]> {
    const trips = await this.tripRepository.find({
      relations: { steps: true },
    });
    return trips;
  }

  async findOne(id: number) {
    return await this.tripRepository.findOne({
      where: { id: id },
      relations: { steps: true },
    });
  }

  update(id: number, updateTripDto: UpdateTripDto) {
    console.log(updateTripDto);
    console.log(updateTripDto);
    return `This action updates a #${id} trip`;
  }

  remove(id: number) {
    return `This action removes a #${id} trip`;
  }
}
