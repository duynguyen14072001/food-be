import { Injectable } from '@nestjs/common';
import { CreateFaqListDto } from './dto/create-faq.dto';
import { getIds } from 'src/helper';
import { Faq } from './entities/faq.entity';
import { In, Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { ResponseList } from './dto/faq.res';
import { FaqDto } from './dto/faq.dto';

@Injectable()
export class FaqsService {
  constructor(
    @InjectRepository(Faq)
    private faqRepository: Repository<Faq>,
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

  async upsert(createFaqListDto: CreateFaqListDto) {
    const existIds = await getIds(createFaqListDto.faqs);
    const bannerDeletes = await this.faqRepository.findBy({
      id: Not(In(existIds)),
    });
    const deleteIds = await getIds(bannerDeletes);
    deleteIds.length && (await this.faqRepository.delete(deleteIds));
    await this.faqRepository.upsert(createFaqListDto.faqs, ['id']);
    return true;
  }

  async findAll(query: any): Promise<ResponseList> {
    try {
      const { page, per_page: perPage } = query;
      const options = await this.mapOptions(query);
      const total = await this.faqRepository.count(options);
      const data = await this.faqRepository.find(options);

      const result = await this.classMapper.mapArrayAsync(data, Faq, FaqDto);
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
