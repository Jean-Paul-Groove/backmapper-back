import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
} from '@nestjs/common';
import { TripsService } from './trips.service';
import { CreateTripDto } from './dto/create-trip.dto';
import { Trip } from './entities/trip.entity';
import { UpdateResult } from 'typeorm';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('api/trips')
export class TripsController {
  constructor(private readonly tripsService: TripsService) {}
  @UseGuards(AuthGuard)
  @Post()
  createTrip(@Body() createTripDto: CreateTripDto): Promise<Trip> {
    return this.tripsService.createTrip(createTripDto);
  }
  @Get()
  findAllTrips(): Promise<Trip[]> {
    return this.tripsService.findAll();
  }
  @Get(':id')
  findOneTrip(@Param('id') id: string): Promise<Trip> {
    return this.tripsService.findOne(+id);
  }

  @UseGuards(AuthGuard)
  @Put('/:id')
  updateTrip(
    @Param('id') id: string,
    @Body() newTripInfo: CreateTripDto,
  ): Promise<UpdateResult> {
    return this.tripsService.updateTrip(+id, newTripInfo);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  removeTrip(@Param('id') id: string) {
    return this.tripsService.removeTrip(+id);
  }
}
