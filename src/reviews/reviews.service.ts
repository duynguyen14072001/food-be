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
        user: true,
      },
    };

    if (filters?.length) {
      const filterList = filters.filter((item) => item.data);
      for (const i of filterList) {
        const { key, data } = i;
        if (key === 'product_id') {
          options.where = {
            ...options.where,
            product_id: Equal(data),
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

  async create(createReviewDto: CreateReviewDto, req: any) {
    try {
      const createDataDto = {
        ...createReviewDto,
        user_id: req.user.id,
      };
      const createData = this.reviewRepository.create(createDataDto);
      return await this.reviewRepository.save(createData);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async findAll(query: any) {
    try {
      const { page, per_page: perPage } = query;
      const options = await this.mapOptions(query);
      const total = await this.reviewRepository.count(options);
      const starCounts = await this.reviewRepository
        .createQueryBuilder('review')
        .select('review.star_number', 'star_number')
        .addSelect('COUNT(*)', 'count')
        .where(options?.where || {})
        .groupBy('review.star_number')
        .getRawMany();

      const totalStars = starCounts.reduce(
        (sum, item) => sum + Number(item.star_number) * Number(item.count),
        0,
      );
      const averageRating = total > 0 ? totalStars / total : 0;

      const percentages = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

      starCounts.forEach(({ star_number, count }) => {
        percentages[star_number] = total
          ? parseFloat(((Number(count) / total) * 100).toFixed(1))
          : 0;
      });

      const data = await this.reviewRepository.find(options);
      return {
        data,
        page,
        perPage,
        total,
        percentages,
        averageRating: parseFloat(averageRating.toFixed(1)),
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
        throw new NotFoundException(`Could not find review with id: ${id}`);
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
        throw new NotFoundException(`Could not find review with id: ${id}`);
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
