import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { Cart } from './entities/cart.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, In, Repository } from 'typeorm';

@Injectable()
export class CartsService {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
  ) {}

  async mapOptions(query: any, user: any) {
    const { page, per_page, orders, all } = query;
    const orderMap = orders?.reduce(function (result, item) {
      result[item['key']] = item['dir'];
      return result;
    }, {});

    const options = {
      order: orderMap,
      where: {
        user_id: Equal(user.id),
      },
      relations: {
        product: true,
      },
    };
    if (!all && page && per_page) {
      options['skip'] = (page - 1) * per_page;
      options['take'] = per_page;
    }
    return options;
  }

  async create(createCartDto: CreateCartDto, req: any) {
    try {
      const createData = {
        ...createCartDto,
        user_id: req.user.id,
      };
      const create = this.cartRepository.create(createData);
      const data = await this.cartRepository.save(create);

      return data;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async findAll(req: any, query: any) {
    try {
      const { page, per_page: perPage } = query;
      const { user } = req;
      const options = await this.mapOptions(query, user);
      const total = await this.cartRepository.count(options);
      const data = await this.cartRepository.find(options);
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

  async update(id: number, updateCartDto: UpdateCartDto, req: any) {
    try {
      const data = await this.cartRepository.findOne({
        where: { id },
      });
      if (!data) {
        throw new NotFoundException(`Could not find Category with id: ${id}`);
      }
      if (data.user_id !== req.user.id) {
        throw new ForbiddenException(`No permission`);
      }
      const newData = await this.cartRepository.create({
        ...data,
        ...updateCartDto,
      });
      await this.cartRepository.update({ id }, newData);

      return await newData;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async remove(ids: number[] | string[], req: any) {
    try {
      const listId =  ids.map((item) => Number(item))

      const dataList = await this.cartRepository.find({
        where: {
          id: In(listId)
        },
      });

      if (dataList.length === 0) {
        throw new NotFoundException(
          `Could not find Cart with id(s): ${ids.join(', ')}`,
        );
      }

      for (const data of dataList) {
        if (data.user_id !== req.user.id) {
          throw new ForbiddenException(
            `No permission for cart with id: ${data.id}`,
          );
        }
      }
      return await this.cartRepository
        .createQueryBuilder()
        .delete()
        .from('carts')
        .where('id IN (:...ids)', { ids:listId })
        .execute();
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
