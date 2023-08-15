import {
  Injectable,
  Logger,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateStepDto } from './dto/update-step.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Trip } from './entities/trip.entity';
import { Step } from './entities/step.entity';
import { Repository } from 'typeorm';
import { CreateStepDto } from './dto/create-step.dto';
import * as fs from 'fs';

@Injectable()
export class TripsService {
  constructor(
    @InjectRepository(Trip) private readonly tripRepository: Repository<Trip>,
    @InjectRepository(Step) private readonly stepRepository: Repository<Step>,
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
  async createStep(
    createStepDto: CreateStepDto,
    tripId: number,
    pictures?: string[],
  ): Promise<Step> {
    try {
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

  async updateStep(
    id: number,
    updateStepDto: UpdateStepDto,
    pictures?: string[],
  ) {
    const stepToUpdate = await this.stepRepository.findOneBy({ id });
    if (!stepToUpdate) {
      throw new HttpException('Step not found', HttpStatus.NOT_FOUND);
    }
    const updateEntity = new Step();
    const { title, description, coordinates, date } = updateStepDto;
    updateEntity.title = title;
    updateEntity.description = description;
    updateEntity.coordinates = coordinates.toString();
    updateEntity.date = date.toString();
    const currentPictures = stepToUpdate.pictures.split(',');
    const picturesAfterDeletion = updateStepDto.picturesToDelete
      ? currentPictures.filter(
          (picture) =>
            updateStepDto.picturesToDelete.includes(picture) === false,
        )
      : currentPictures;
    if (pictures) {
      const newPictureArray = [...picturesAfterDeletion, ...pictures];
      if (newPictureArray.length > 4) {
        this.deleteImagesFromServer(pictures.toString());
        throw new HttpException(
          'Maximum 4 photos par étapes ...',
          HttpStatus.BAD_REQUEST,
        );
      } else {
        updateEntity.pictures = newPictureArray.toString();
      }
    } else {
      updateEntity.pictures = picturesAfterDeletion.toString();
    }
    const stepUpdated = await this.stepRepository.update({ id }, updateEntity);
    if (updateStepDto.picturesToDelete) {
      this.deleteImagesFromServer(updateStepDto.picturesToDelete.toString());
    }

    return stepUpdated;
  }

  async removeStep(id: number) {
    const stepToRemove = await this.stepRepository.findOne({
      where: { id: id },
    });
    if (!stepToRemove) {
      throw new NotFoundException(`Le step avec id ${id} n'existe pas`);
    }
    const stepRemoved = await this.stepRepository.remove(stepToRemove);
    this.deleteImagesFromServer(stepRemoved.pictures);
    return stepRemoved;
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
    this.deleteImagesFromServer(stepsPicturesToBeDeleted.toString());
    return tripDeleted;
  }
  private deleteImagesFromServer(images: string) {
    const imgArray: string[] = images.split(',');
    for (const img of imgArray) {
      fs.unlink(img, (err) => {
        if (err) {
          console.log(err);
        }
      });
    }
  }
}
