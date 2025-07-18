import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { ResponseList } from './dto/category.res';
import { CategoryDto } from './dto/category.dto';
import { ProductCategoryService } from 'src/products/product-category.service';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    private productCategoryService: ProductCategoryService,
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
      where: {},
    };
    if (!all && page && per_page) {
      options['skip'] = (page - 1) * per_page;
      options['take'] = per_page;
    }
    return options;
  }

  async create(createCategoryDto: CreateCategoryDto): Promise<CategoryDto> {
    try {
      const createData = this.categoryRepository.create(createCategoryDto);
      const data = await this.categoryRepository.save(createData);

      return await this.classMapper.mapAsync(data, Category, CategoryDto);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async findAll(query: any): Promise<ResponseList> {
    try {
      const { page, per_page: perPage } = query;
      const options = await this.mapOptions(query);
      const total = await this.categoryRepository.count(options);
      const data = await this.categoryRepository.find(options);

      const result = await this.classMapper.mapArrayAsync(
        data,
        Category,
        CategoryDto,
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

  async findOneByID(id: number): Promise<CategoryDto> {
    const data = await this.categoryRepository.findOneBy({ id });
    return await this.classMapper.mapAsync(data, Category, CategoryDto);
  }

  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<CategoryDto> {
    try {
      const data = await this.categoryRepository.findOne({
        where: { id },
      });
      if (!data) {
        throw new NotFoundException(`Could not find Category with id: ${id}`);
      }
      const newData = await this.categoryRepository.create({
        ...data,
        ...updateCategoryDto,
      });
      await this.categoryRepository.update({ id }, newData);

      return await this.classMapper.mapAsync(newData, Category, CategoryDto);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async remove(ids: number[] | number) {
    try {
      await this.productCategoryService.removeByCategory(ids);
      return await this.categoryRepository.delete(ids);
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
