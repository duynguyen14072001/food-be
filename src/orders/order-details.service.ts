import { Injectable } from '@nestjs/common';
import { OrderDetail } from './entities/order-detail.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateOrderDetailDto,
  CreateOrderDetailListDto,
} from './dto/create-order-detail.dto';

@Injectable()
export class OrderDetailsService {
  constructor(
    @InjectRepository(OrderDetail)
    private orderDetailRepository: Repository<OrderDetail>,
  ) {}

  async create(createOrderDetailListDto: CreateOrderDetailDto[]) {
    return await this.orderDetailRepository.upsert(createOrderDetailListDto, [
      'id',
    ]);
  }
}
