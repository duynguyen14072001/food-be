import { ProductCategoryService } from './product-category.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { DataSource, Repository } from 'typeorm';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { ResponseList } from './dto/product.res';
import { ProductDto } from './dto/product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectMapper() private readonly classMapper: Mapper,
    private dataSource: DataSource,
    private productCategoryService: ProductCategoryService,
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
      relations: {
        productCategories: {
          category: true,
        },
      },
    };
    if (!all && page && per_page) {
      options['skip'] = (page - 1) * per_page;
      options['take'] = per_page;
    }
    return options;
  }

  async create(createProductDto: CreateProductDto): Promise<ProductDto> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const { category_id, ...createData } = createProductDto;

      // Insert product
      const createProduct = this.productRepository.create(createData);
      const data = await this.productRepository.save(createProduct);

      // Insert product_category
      await this.productCategoryService.create(
        +data.id,
        category_id.map(Number),
      );

      await queryRunner.commitTransaction();
      return await this.classMapper.mapAsync(data, Product, ProductDto);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new Error(error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(query: any): Promise<ResponseList> {
    try {
      const { page, per_page: perPage } = query;
      const options = await this.mapOptions(query);
      const total = await this.productRepository.count(options);
      const data = await this.productRepository.find(options);

      const result = await this.classMapper.mapArrayAsync(
        data,
        Product,
        ProductDto,
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

  async findOneByID(id: number): Promise<ProductDto> {
    try {
      const data = await this.productRepository.findOne({
        where: { id },
        relations: {
          productCategories: {
            category: true,
          },
        },
      });

      if (!data) {
        throw new NotFoundException(`Could not find Product with id: ${id}`);
      }
      return await this.classMapper.mapAsync(data, Product, ProductDto);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async update(id: number, updateProductDto: UpdateProductDto): Promise<ProductDto> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const { category_id, ...updateData } = updateProductDto;

      // Update product
      const newData = await this.productRepository.create({ ...updateData });
      await this.productRepository.update({ id }, newData);

      // Upsert product_category
      await this.productCategoryService.update(+id, category_id.map(Number));

      await queryRunner.commitTransaction();
      return await this.findOneByID(id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new Error(error.message);
    } finally {
      await queryRunner.release();
    }
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
