import { Injectable, PipeTransform } from '@nestjs/common';
import * as path from 'path';
import * as sharp from 'sharp';

@Injectable()
export class ImgOptimizationPipe
  implements PipeTransform<Express.Multer.File[], Promise<string[]>>
{
  async transform(
    images: Express.Multer.File[] | null,
  ): Promise<string[] | null> {
    if (!images) {
      return null;
    }

    const newImages: string[] = [];
    for (const image of images) {
      const originalName = path.parse(image.originalname).name;
      const filename = Date.now() + '-' + originalName + '.webp';

      await sharp(image.buffer)
        .resize(800)
        .webp({ effort: 3 })
        .toFile(path.join('step-pictures', filename));

      newImages.push('step-pictures/' + filename);
    }
    return newImages;
  }
}
