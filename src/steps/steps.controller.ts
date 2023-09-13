import {
  Controller,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UploadedFiles,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { StepsService } from './steps.service';
import { CreateStepDto } from './dto/create-step.dto';
import { UpdateStepDto } from './dto/update-step.dto';
import { ImgOptimizationPipe } from './pipes/imgOptimization.pipe';
import { FilesInterceptor } from '@nestjs/platform-express';
import { multerConfig } from 'src/configuration/multer.config';
import { UpdateResult } from 'typeorm';
import { CreateStepWithPicturesDto } from './dto/create-step-with-pictures.dto';
import { UpdateStepWithPicturesDto } from './dto/update-step-with-pictures.dto';
import { Step } from './entities/step.entity';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('api/trips/steps')
export class StepsController {
  constructor(private readonly stepsService: StepsService) {}

  @UseGuards(AuthGuard)
  @Post(':tripId')
  @UseInterceptors(FilesInterceptor('files', 4, multerConfig))
  createStep(
    @UploadedFiles(ImgOptimizationPipe) pictures: string[] | null,
    @Body() body: CreateStepDto | CreateStepWithPicturesDto,
    @Param('tripId') tripId: string,
  ): Promise<Step> {
    try {
      if (!pictures) {
        return this.stepsService.createStep(body as CreateStepDto, +tripId);
      } else {
        const stepWithPictures = body as CreateStepWithPicturesDto;
        const newStepContent = JSON.parse(stepWithPictures.stepInfo);
        return this.stepsService.createStep(newStepContent, +tripId, pictures);
      }
    } catch (error) {
      console.log(error);
    }
  }

  @UseGuards(AuthGuard)
  @Put(':stepId')
  @UseInterceptors(FilesInterceptor('files', 4))
  updateStep(
    @UploadedFiles(ImgOptimizationPipe) pictures: string[] | null,
    @Body() body: UpdateStepDto | UpdateStepWithPicturesDto,
    @Param('stepId') id: string,
  ): Promise<UpdateResult> {
    let updateStepDto;
    if (!pictures) {
      updateStepDto = body;
      return this.stepsService.updateStep(+id, updateStepDto);
    } else {
      const stepWithPictures = body as UpdateStepWithPicturesDto;
      updateStepDto = JSON.parse(stepWithPictures.stepInfo);
      return this.stepsService.updateStep(+id, updateStepDto, pictures);
    }
  }

  @UseGuards(AuthGuard)
  @Delete(':stepId')
  removeStep(@Param('stepId') id: string) {
    return this.stepsService.removeStep(+id);
  }
}
