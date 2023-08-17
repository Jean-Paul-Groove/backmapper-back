import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateStepDto } from './dto/create-step.dto';
import { UpdateStepDto } from './dto/update-step.dto';
import { Step } from './entities/step.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Trip } from 'src/trips/entities/trip.entity';
import { Repository } from 'typeorm';
import * as fs from 'fs';

@Injectable()
export class StepsService {
  constructor(
    @InjectRepository(Trip) private readonly tripRepository: Repository<Trip>,
    @InjectRepository(Step) private readonly stepRepository: Repository<Step>,
  ) {}
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
  deleteImagesFromServer(images: string) {
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
