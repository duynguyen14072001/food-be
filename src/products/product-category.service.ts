import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductCategory } from './entities/product-category.entity';
import { In, Repository } from 'typeorm';

@Injectable()
export class ProductCategoryService {
  constructor(
    @InjectRepository(ProductCategory)
    private productCategoryRepository: Repository<ProductCategory>,
  ) {}

  async create(productId: number, categoryIds: number[]): Promise<boolean> {
    try {
      const arr = categoryIds.map((item) => ({
        category_id: item,
        product_id: productId,
      }));
      await this.productCategoryRepository.insert(arr);
      return true;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async update(productId: number, categoryIds: number[]): Promise<boolean> {
    try {
      const list = await this.productCategoryRepository.find({
        where: {
          product_id: productId,
        },
      });

      const deleteIds = list
        .filter((item) => !categoryIds.includes(+item.category_id))
        .map((item) => +item.id);
      deleteIds.length && (await this.remove(deleteIds));

      // Array create
      const arrayCreate = categoryIds
        .filter(
          (itemKey) => !list.map((item) => +item.category_id).includes(itemKey),
        )
        .map((item) => ({
          category_id: +item,
          product_id: productId,
          id: null,
        }));

      // Array update
      const arrUpdate = list
        .filter((item) => !deleteIds.includes(+item.id))
        .map((item) => ({
          category_id: item.category_id,
          product_id: productId,
          id: item.id,
        }));

      await this.productCategoryRepository.upsert(
        arrUpdate.concat(arrayCreate),
        ['id'],
      );

      return true;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async remove(ids: number[] | number) {
    try {
      return await this.productCategoryRepository.delete(ids);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async removeByCategory(categoryIds: number[] | number) {
    try {
      const whereCondition = Array.isArray(categoryIds)
        ? { category_id: In(categoryIds) }
        : { category_id: categoryIds };

      return await this.productCategoryRepository.delete(whereCondition);
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
