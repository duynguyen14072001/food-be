import { Injectable } from '@nestjs/common';
import { Order } from './entities/order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { ResponseList } from './dto/order.res';
import { OrderDto } from './dto/order.dto';
import { CreateOrderDetailListDto } from './dto/create-order-detail.dto';
import { OrderDetailsService } from './order-details.service';
import { STATUS_PAYMENT, STATUS_PENDING } from 'src/constants';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectMapper() private readonly classMapper: Mapper,
    private dataSource: DataSource,
    private orderDetailsService: OrderDetailsService,
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
        user: true,
        orderDetails: true,
      },
    };
    if (!all && page && per_page) {
      options['skip'] = (page - 1) * per_page;
      options['take'] = per_page;
    }
    return options;
  }

  async create(createOrderDetailListDto: CreateOrderDetailListDto, req: any) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const { shipping_address, note, orders, payment_method } =
        createOrderDetailListDto;

      // Insert order
      const createOrder = this.orderRepository.create({
        user_id: req.user.id,
        status: STATUS_PENDING,
        shipping_address,
        note,
        payment_method,
        payment_status: STATUS_PAYMENT,
      });

      // Insert order detail
      const data = await this.orderRepository.save(createOrder);
      const dataDetail = orders.map((item) => ({ ...item, order_id: data.id }));
      await this.orderDetailsService.create(dataDetail);
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
      const total = await this.orderRepository.count(options);
      const data = await this.orderRepository.find(options);

      const result = await this.classMapper.mapArrayAsync(
        data,
        Order,
        OrderDto,
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

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
