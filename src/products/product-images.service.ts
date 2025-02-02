import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductImages } from './entities/product-images.entity';

@Injectable()
export class ProductImagesService {
  constructor(
    @InjectRepository(ProductImages)
    private productImagesRepository: Repository<ProductImages>,
  ) {}

  async create(productId: number, imagesUrl: string[]): Promise<boolean> {
    try {
      const arr = imagesUrl.map((item) => ({
        image_url: item,
        product_id: productId,
      }));
      await this.productImagesRepository.insert(arr);
      return true;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async update(productId: number, imagesUrl: string[]): Promise<boolean> {
    try {
      const list = await this.productImagesRepository.find({
        where: {
          product_id: productId,
        },
      });

      const deleteIds = list
        .filter((item) => !imagesUrl.includes(item.image_url))
        .map((item) => +item.id);
      deleteIds.length && (await this.remove(deleteIds));

      // Array create
      const arrayCreate = imagesUrl
        .filter(
          (itemKey) => !list.map((item) => item.image_url).includes(itemKey),
        )
        .map((item) => ({
          image_url: item,
          product_id: productId,
          id: null,
        }));

      // // Array update
      const arrUpdate = list
        .filter((item) => !deleteIds.includes(+item.id))
        .map((item) => ({
          image_url: item.image_url,
          product_id: productId,
          id: item.id,
        }));

      await this.productImagesRepository.upsert(arrUpdate.concat(arrayCreate), [
        'id',
      ]);

      return true;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async remove(ids: number[] | number) {
    try {
      return await this.productImagesRepository.delete(ids);
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
