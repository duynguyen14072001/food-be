import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Equal, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
  ) {}

  async mapOptions(query: any) {
    const { page, per_page, orders, all, filters } = query;
    const orderMap = orders?.reduce(function (result, item) {
      result[item['key']] = item['dir'];
      return result;
    }, {});

    const options = {
      order: orderMap,
      where: {},
      relations: {
        product: true,
      },
    };

    if (filters?.length) {
      const filterList = filters.filter((item) => item.data);
      for (const i of filterList) {
        const { key, data } = i;
        if (key === 'product_id') {
          options.where = {
            ...options.where,
            id: Equal(data),
          };
        }
      }
    }

    if (!all && page && per_page) {
      options['skip'] = (page - 1) * per_page;
      options['take'] = per_page;
    }
    return options;
  }

  create(createReviewDto: CreateReviewDto, req: any) {
    return 'This action adds a new review';
  }

  async findAll(query: any) {
    try {
      const { page, per_page: perPage } = query;
      const options = await this.mapOptions(query);
      const total = await this.reviewRepository.count(options);
      const data = await this.reviewRepository.find(options);
      return {
        data,
        page,
        perPage,
        total,
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async update(id: number, updateReviewDto: UpdateReviewDto, req: any) {
    try {
      const data = await this.reviewRepository.findOne({
        where: { id },
      });
      if (!data) {
        throw new NotFoundException(`Could not find Category with id: ${id}`);
      }
      if (data.user_id !== req.user.id) {
        throw new ForbiddenException(`No permission`);
      }
      const newData = await this.reviewRepository.create({
        ...data,
        ...updateReviewDto,
      });
      await this.reviewRepository.update({ id }, newData);

      return await newData;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async remove(id: number, req: any) {
    try {
      const data = await this.reviewRepository.findOne({
        where: { id },
      });
      if (!data) {
        throw new NotFoundException(`Could not find Category with id: ${id}`);
      }
      if (data.user_id !== req.user.id) {
        throw new ForbiddenException(`No permission`);
      }
      return await this.reviewRepository.delete(id);
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
