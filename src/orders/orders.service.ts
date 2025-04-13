import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Order } from './entities/order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, DataSource, Equal, Repository } from 'typeorm';
import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { ResponseList } from './dto/order.res';
import { OrderDto } from './dto/order.dto';
import { CreateOrderDetailListDto } from './dto/create-order-detail.dto';
import { OrderDetailsService } from './order-details.service';
import {
  PLACE_ID_BASE_LOCATION,
  STATUS_PENDING,
  UNPAID_STATUS,
} from 'src/constants';
import { UpdateStatusOrderDto } from './dto/update-status-order.dto';
import { UpdateStatusPaymentOrderDto } from './dto/update-status-payment-order.dto';
import { MapsService } from 'src/maps/maps.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectMapper() private readonly classMapper: Mapper,
    private dataSource: DataSource,
    private orderDetailsService: OrderDetailsService,
    private mapsService: MapsService,
  ) {}

  async mapOptions(query: any, user: any = null) {
    const { search, page, per_page, orders, all, filters } = query;
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

    if (user) {
      options.where = {
        ...options.where,
        user_id: Equal(user.id),
      };
    }

    if (filters?.length) {
      const filterList = filters.filter((item) => item.data);
      for (const i of filterList) {
        const { key, data } = i;
        if (key === 'date_range') {
          options.where = {
            ...options.where,
            created_at: Between(data[0], data[1]),
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

  async create(createOrderDetailListDto: CreateOrderDetailListDto, req: any) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const { shipping_address, note, orders, payment_method, place_id } =
        createOrderDetailListDto;

      const expected_delivery_time = await this.mapsService.getTravelTime(
        PLACE_ID_BASE_LOCATION,
        place_id,
      );
      // Insert order
      const createOrder = this.orderRepository.create({
        user_id: req.user.id,
        status: STATUS_PENDING,
        shipping_address,
        note,
        expected_delivery_time,
        payment_method,
        payment_status: UNPAID_STATUS,
      });

      // Insert order detail
      const data = await this.orderRepository.save(createOrder);
      const dataDetail = orders.map((item) => ({ ...item, order_id: data.id }));
      await this.orderDetailsService.create(dataDetail);

      await queryRunner.commitTransaction();
      return data;
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

  async findOneByID(id: number, req: any): Promise<any> {
    try {
      const data = await this.orderRepository.findOne({
        where: { id },
        relations: {
          orderDetails: {
            product: true,
          },
        },
      });

      if (data.user_id !== req.user.id) {
        throw new ForbiddenException(`No permission`);
      }

      if (!data) {
        throw new NotFoundException(`Could not find Order with id: ${id}`);
      }
      return await data;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async findOneByIDHaveMapper(id: number, req: any): Promise<any> {
    try {
      const data = (await this.orderRepository.findOne({
        where: { id },
        relations: {
          user: true,
          orderDetails: {
            product: true,
          },
        },
      })) as any;

      if (data.user_id !== req.user.id) {
        throw new ForbiddenException(`No permission`);
      }

      if (!data) {
        throw new NotFoundException(`Could not find Order with id: ${id}`);
      }
      const result = await this.classMapper.mapAsync(data, Order, OrderDto);
      data.total_price = result.total_price;
      return data;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async findAllByUser(query: any, req: any): Promise<ResponseList> {
    try {
      const { page, per_page: perPage } = query;
      const options = await this.mapOptions(query, req.user);
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

  async updateStatus(id: number, updateStatusOrderDto: UpdateStatusOrderDto) {
    try {
      const newData = await this.orderRepository.create({
        ...updateStatusOrderDto,
      });
      const data = await this.orderRepository.update({ id }, newData);

      if (!data) {
        throw new UnauthorizedException();
      }
      return true;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async updateStatusPayment(
    id: number,
    updateStatusPaymentOrderDto: UpdateStatusPaymentOrderDto,
  ) {
    try {
      const newData = await this.orderRepository.create({
        ...updateStatusPaymentOrderDto,
      });
      const data = await this.orderRepository.update({ id }, newData);

      if (!data) {
        throw new UnauthorizedException();
      }
      return true;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
