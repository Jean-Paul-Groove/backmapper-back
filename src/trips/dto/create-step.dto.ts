export class CreateStepDto {
  title: string;
  description: string;
  coordinates: [longitude: number, latitude: number];
  date: number;
}
