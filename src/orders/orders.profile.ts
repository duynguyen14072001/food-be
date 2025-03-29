import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, forMember, mapFrom, type Mapper } from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { Order } from './entities/order.entity';
import { OrderDto } from './dto/order.dto';

@Injectable()
export class OrdersProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper) => {
      createMap(
        mapper,
        Order,
        OrderDto,
        forMember(
          (d) => d.user_name,
          mapFrom((e) => e.user.name),
        ),
        forMember(
          (d) => d.item_count,
          mapFrom((e) =>
            e.orderDetails.reduce((total, item) => total + item.quantity, 0),
          ),
        ),
        forMember(
          (d) => d.total_price,
          mapFrom((e) =>
            e.orderDetails.reduce((total, item) => total + item.amount, 0),
          ),
        ),
      );
    };
  }
}
