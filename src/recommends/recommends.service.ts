import { Injectable } from '@nestjs/common';
import { CreateRecommendListDto } from './dto/create-recommend.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Recommend } from './entities/recommend.entity';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { In, Not, Repository } from 'typeorm';
import { ResponseList } from './dto/recommend.res';
import { RecommendDto } from './dto/recommend.dto';
import { getIds } from 'src/helper';

@Injectable()
export class RecommendsService {
  constructor(
    @InjectRepository(Recommend)
    private recommendRepository: Repository<Recommend>,
    @InjectMapper() private readonly classMapper: Mapper,
  ) {}

  async mapOptions(query: any) {
    const { search, page, per_page, orders, all } = query;
    const orderMap = orders?.reduce(function (result, item) {
      result[item['key']] = item['dir'];
      return result;
    }, {});

    const options = {
      order: orderMap,
      relations: {
        product: true,
      },
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

  async upsert(createRecommendListDto: CreateRecommendListDto) {
    const existIds = await getIds(createRecommendListDto.recommends);
    const recommendDeletes = await this.recommendRepository.findBy({
      id: Not(In(existIds)),
    });
    const deleteIds = await getIds(recommendDeletes);
    deleteIds.length && (await this.recommendRepository.delete(deleteIds));
    await this.recommendRepository.upsert(createRecommendListDto.recommends, [
      'id',
    ]);
    return true;
  }

  async findAll(query: any): Promise<ResponseList> {
    try {
      const { page, per_page: perPage } = query;
      const options = await this.mapOptions(query);
      const total = await this.recommendRepository.count(options);
      const data = await this.recommendRepository.find(options);

      return {
        data: data,
        page,
        perPage,
        total,
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
