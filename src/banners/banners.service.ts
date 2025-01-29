import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Banner } from './entities/banner.entity';
import { In, Not, Repository } from 'typeorm';
import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { UploadsService } from '../uploads/uploads.service';
import { CreateBannerListDto } from './dto/create-banner.dto';
import { BannerDto } from './dto/banner.dto';
import { ResponseList } from './dto/banner.res';
import { getIds } from 'src/helper';

@Injectable()
export class BannersService {
  constructor(
    @InjectRepository(Banner)
    private bannerRepository: Repository<Banner>,
    @InjectMapper() private readonly classMapper: Mapper,
    private uploadService: UploadsService,
  ) {}

  async mapOptions(query: any) {
    const { search, page, per_page, orders, all } = query;
    const orderMap = orders?.reduce(function (result, item) {
      result[item['key']] = item['dir'];
      return result;
    }, {});

    const options = {
      order: orderMap,
    };
    if (search) {
      options['where'] = {
        name: search,
      };
    }
    if (!all && page && per_page) {
      options['skip'] = (page - 1) * per_page;
      options['take'] = per_page;
    }
    return options;
  }

  async upsert(createListBannerDto: CreateBannerListDto) {
    try {
      const existIds = await getIds(createListBannerDto.banners);
      const bannerDeletes = await this.bannerRepository.findBy({
        id: Not(In(existIds)),
      });
      const deleteIds = await getIds(bannerDeletes);
      deleteIds.length && (await this.bannerRepository.delete(deleteIds));

      // const removeImgs: string[] = [];
      // const arrImgsNews = convertArr(createBannerDto.banners);
      // const banners = await this.findAll({});
      // const arrImgsCurrent = convertArr(banners.data);
      // for (const img of arrImgsCurrent) {
      //   !arrImgsNews.includes(img) && removeImgs.push(img);
      // }
      // const fileNames = await this.mapFileName(removeImgs);
      // const fileNamesNew = await this.mapFileName(arrImgsNews);
      // // Remove images
      // await this.uploadService.removeFile(fileNames);
      // // Update updated_at imgs
      // await this.uploadService.updateUpdatedAt(fileNamesNew, 'file');
      await this.bannerRepository.upsert(createListBannerDto.banners, ['id']);
      return true;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async findAll(query: any): Promise<ResponseList> {
    try {
      const { page, per_page: perPage } = query;
      const options = await this.mapOptions(query);
      const total = await this.bannerRepository.count(options);
      const data = await this.bannerRepository.find(options);

      const result = await this.classMapper.mapArrayAsync(
        data,
        Banner,
        BannerDto,
      );
      return {
        data: result,
        page,
        perPage,
        total,
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
