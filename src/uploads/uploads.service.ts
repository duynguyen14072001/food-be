import { Injectable } from '@nestjs/common';
import { CreateUploadDto } from './dto/create-upload.dto';
import { UpdateUploadDto } from './dto/update-upload.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UploadsCloudinaryService } from './uploads-cloudinary.service';
import { File } from './entities/upload.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UploadsService {
  constructor(
    @InjectRepository(File)
    private fileRepository: Repository<File>,
    private uploadsCloudinary: UploadsCloudinaryService,
  ) {}
  async uploadFile(file, req) {
    const { originalname, mimetype, size } = file;
    const result = await this.uploadsCloudinary.uploadFile(
      file,
      req.query.type,
    );

    const mapData = {
      mime_type: mimetype,
      url: result.url,
      original_name: originalname,
      file_name: result.public_id,
      type: req.query.type,
      size,
    };

    this.fileRepository.save(mapData);
    return result.url;
  }
}
