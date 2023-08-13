import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
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

@Controller('trips')
export class TripsController {
  constructor(private readonly tripsService: TripsService) {}

  @Post()
  createTrip(@Body() createTripDto: CreateTripDto): Promise<Trip> {
    return this.tripsService.createTrip(createTripDto);
  }
  @Post(':id/step')
  @UseInterceptors(FilesInterceptor('files', 4, multerConfig))
  createStep(
    @UploadedFiles(ImgOptimizationPipe) pictures: string[] | null,
    @Body() body: CreateStepDto | CreateStepWithPicturesDto,
    @Param('id') id: string,
  ): Promise<Step> {
    try {
      console.log(pictures);
      console.log('Depuis le controller');
      if (!pictures) {
        return this.tripsService.createStep(body as CreateStepDto, +id);
      } else {
        const stepWithPictures = body as CreateStepWithPicturesDto;
        console.log(' Depuis le controlleur => doit avoir une image');
        const newStepContent = JSON.parse(stepWithPictures.stepInfo);
        return this.tripsService.createStep(newStepContent, +id, pictures);
      }
    } catch (error) {
      console.log(error);
    }
  }

  @Get()
  findAllTrips(): Promise<Trip[]> {
    return this.tripsService.findAll();
  }

  @Get(':id')
  findOneTrip(@Param('id') id: string) {
    return this.tripsService.findOne(+id);
  }

  @Patch('steps/:stepId')
  updateStep(
    @Param('stepId') id: string,
    @Body() updateStepDto: UpdateStepDto,
  ) {
    return this.tripsService.updateStep(+id, updateStepDto);
  }

  @Delete('steps/:stepId')
  removeStep(@Param('stepId') id: string) {
    return this.tripsService.removeStep(+id);
  }
  @Delete(':id')
  removeTrip(@Param('id') id: string) {
    return this.tripsService.removeTrip(+id);
  }
}
