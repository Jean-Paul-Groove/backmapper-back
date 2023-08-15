import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  Put,
} from '@nestjs/common';
import { TripsService } from './trips.service';
import { CreateTripDto } from './dto/create-trip.dto';
import { Trip } from './entities/trip.entity';
import { Step } from './entities/step.entity';
import { CreateStepDto } from './dto/create-step.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { multerConfig } from 'src/configuration/multer.config';
import { CreateStepWithPicturesDto } from './dto/create-step-with-pictures.dto';
import { ImgOptimizationPipe } from './pipes/imgOptimization.pipe';
import { UpdateStepDto } from './dto/update-step.dto';
import { UpdateStepWithPicturesDto } from './dto/update-step-with-pictures.dto';
import { UpdateResult } from 'typeorm';

@Controller('trips')
export class TripsController {
  constructor(private readonly tripsService: TripsService) {}

  @Post()
  createTrip(@Body() createTripDto: CreateTripDto): Promise<Trip> {
    return this.tripsService.createTrip(createTripDto);
  }
  @Get()
  findAllTrips(): Promise<Trip[]> {
    return this.tripsService.findAll();
  }
  @Get(':id')
  findOneTrip(@Param('id') id: string) {
    return this.tripsService.findOne(+id);
  }
  @Put('/:id')
  updateTrip(
    @Param('id') id: string,
    @Body() newTripInfo: CreateTripDto,
  ): Promise<UpdateResult> {
    return this.tripsService.updateTrip(+id, newTripInfo);
  }
  @Delete(':id')
  removeTrip(@Param('id') id: string) {
    return this.tripsService.removeTrip(+id);
  }

  @Post(':id/step')
  @UseInterceptors(FilesInterceptor('files', 4, multerConfig))
  createStep(
    @UploadedFiles(ImgOptimizationPipe) pictures: string[] | null,
    @Body() body: CreateStepDto | CreateStepWithPicturesDto,
    @Param('id') id: string,
  ): Promise<Step> {
    try {
      if (!pictures) {
        return this.tripsService.createStep(body as CreateStepDto, +id);
      } else {
        const stepWithPictures = body as CreateStepWithPicturesDto;
        const newStepContent = JSON.parse(stepWithPictures.stepInfo);
        return this.tripsService.createStep(newStepContent, +id, pictures);
      }
    } catch (error) {
      console.log(error);
    }
  }
  @Put('steps/:stepId')
  @UseInterceptors(FilesInterceptor('files', 4))
  updateStep(
    @UploadedFiles(ImgOptimizationPipe) pictures: string[] | null,
    @Body() body: UpdateStepDto | UpdateStepWithPicturesDto,
    @Param('stepId') id: string,
  ): Promise<UpdateResult> {
    let updateStepDto;
    if (!pictures) {
      updateStepDto = body;
      return this.tripsService.updateStep(+id, updateStepDto);
    } else {
      const stepWithPictures = body as UpdateStepWithPicturesDto;
      updateStepDto = JSON.parse(stepWithPictures.stepInfo);
      return this.tripsService.updateStep(+id, updateStepDto, pictures);
    }
  }

  @Delete('steps/:stepId')
  removeStep(@Param('stepId') id: string) {
    return this.tripsService.removeStep(+id);
  }
}
