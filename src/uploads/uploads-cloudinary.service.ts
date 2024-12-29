import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as CLOUDINARY from 'cloudinary';

@Injectable()
export class UploadsCloudinaryService {
  constructor(private configService: ConfigService) {}

  cloudinary = CLOUDINARY.v2.config({
    cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
    api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
    api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
  });

  async uploadFile(file: Express.Multer.File, folder?: string): Promise<any> {
    try {
      const newFileName = `${file.originalname.split('.')[0]}_${Date.now()}`;
      const params = {
        folder: folder || '',
        public_id: newFileName,
        overwrite: true,
      };
      return new Promise((resolve, reject) => {
        const stream = CLOUDINARY.v2.uploader.upload_stream(
          params,
          (error, result) => resolve(result),
        );
        stream.end(file.buffer);
      });
    } catch (error) {
      throw new Error(`Cloudinary upload failed: ${error.message}`);
    }
  }
}
