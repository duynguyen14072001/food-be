import { Module } from '@nestjs/common';
import { UploadsService } from './uploads.service';
import { UploadsController } from './uploads.controller';
import { UploadsCloudinaryService } from './uploads-cloudinary.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { File } from './entities/upload.entity';

@Module({
  imports: [TypeOrmModule.forFeature([File]), ConfigModule],
  controllers: [UploadsController],
  providers: [UploadsService, UploadsCloudinaryService],
})
export class UploadsModule {}
