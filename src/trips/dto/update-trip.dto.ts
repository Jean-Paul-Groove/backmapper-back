import { PartialType } from '@nestjs/mapped-types';
import { CreateTripDto } from './create-trip.dto';

export class UpdateTripDto extends PartialType(CreateTripDto) {
  id: number;
  title: string;
  createdDate: string;
  color: 'vert' | 'azur' | 'bleu' | 'rose' | 'violet' | 'rouge' | 'jaune';
}
