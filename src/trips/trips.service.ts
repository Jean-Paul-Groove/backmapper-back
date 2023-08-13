import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateStepDto } from './dto/update-step.dto';
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
    pictures?: string[],
  ): Promise<Step> {
    try {
      console.log('Depuis le service');
      console.log(createStepDto);
      const step = new Step();
      step.title = createStepDto.title;
      step.coordinates = createStepDto.coordinates.toString();
      step.date = createStepDto.date.toString();
      step.description = createStepDto.description;
      if (pictures) {
        step.pictures = pictures.toString();
      }
      step.trip = await this.tripRepository.findOne({
        where: { id: tripId },
      });

      const stepEntity = this.stepRepository.create(step);
      await this.stepRepository.save(stepEntity);
      return stepEntity;
    } catch (error) {
      console.log(error);
      console.log('erreur !! ' + createStepDto);
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

  async updateStep(id: number, updateStepDto: UpdateStepDto) {
    return `This action updates a #${id} step with ${updateStepDto}`;
  }

  async removeStep(id: number) {
    const stepToRemove = await this.stepRepository.findOne({
      where: { id: id },
    });
    if (!stepToRemove) {
      throw new NotFoundException(`Le step avec id ${id} n'existe pas`);
    }
    return await this.stepRepository.remove(stepToRemove);
  }
  async removeTrip(id: number) {
    const tripToRemove = await this.tripRepository.findOne({
      where: { id: id },
      relations: { steps: true },
    });
    if (!tripToRemove) {
      throw new NotFoundException(`Le trip avec id ${id} n'existe pas`);
    }

    const tripDeleted = await this.tripRepository.remove(tripToRemove);
    /* await this.stepRepository.remove(stepsToRemove);
    const stepsToRemove = await this.stepRepository.findBy({ id: id }); */
    return tripDeleted;
  }
}
