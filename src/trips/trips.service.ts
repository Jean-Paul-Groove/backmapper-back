import {
  Injectable,
  Logger,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CreateTripDto } from './dto/create-trip.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Trip } from './entities/trip.entity';
import { Step } from '../steps/entities/step.entity';
import { Repository } from 'typeorm';
import { StepsService } from 'src/steps/steps.service';

@Injectable()
export class TripsService {
  constructor(
    @InjectRepository(Trip) private readonly tripRepository: Repository<Trip>,
    @InjectRepository(Step) private readonly stepRepository: Repository<Step>,
    private readonly stepService: StepsService,
  ) {}

  async createTrip(createTripDto: CreateTripDto) {
    try {
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

  async updateTrip(id: number, newTripInfo: CreateTripDto) {
    const updatedTrip = new Trip();
    updatedTrip.title = newTripInfo.title;
    updatedTrip.color = newTripInfo.color;
    updatedTrip.startDate = newTripInfo.startDate;
    const tripEntity = this.tripRepository.create(updatedTrip);
    const tripUpdated = await this.tripRepository.update({ id }, tripEntity);
    return tripUpdated;
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
    const stepsPicturesToBeDeleted = tripDeleted.steps.map(
      (step) => step.pictures,
    );
    console.log(stepsPicturesToBeDeleted);
    this.stepService.deleteImagesFromServer(
      stepsPicturesToBeDeleted.toString(),
    );
    return tripDeleted;
  }
}
