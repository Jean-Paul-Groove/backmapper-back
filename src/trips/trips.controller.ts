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
import { UpdateTripDto } from './dto/update-trip.dto';
import { Trip } from './entities/trip.entity';
import { Step } from './entities/step.entity';
import { CreateStepDto } from './dto/create-step.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { multerConfig } from 'src/configuration/multer.config';
import { CreateStepWithPicturesDto } from './dto/create-step-with-pictures.dto';

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
    @UploadedFiles() pictures,
    @Body() body: CreateStepDto | CreateStepWithPicturesDto,
    @Param('id') id: string,
  ): Promise<Step> {
    try {
      if (!pictures) {
        return this.tripsService.createStep(body as CreateStepDto, +id);
      } else {
        const stepWithPictures = body as CreateStepWithPicturesDto;
        console.log(' Depuis le controlleur => doit avoir une image');

        const newStepContent = JSON.parse(stepWithPictures.stepInfo);
        const pictureArray = [];
        pictures.forEach((picture) => {
          pictureArray.push(`step-pictures/${picture.filename}`);
        });
        return this.tripsService.createStep(newStepContent, +id, pictureArray);
      }
    } catch (error) {
      console.log(error);
    }
  }

  @Get()
  findAll(): Promise<Trip[]> {
    return this.tripsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tripsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTripDto: UpdateTripDto) {
    return this.tripsService.update(+id, updateTripDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tripsService.remove(+id);
  }
}
