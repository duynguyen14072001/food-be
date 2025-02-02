import { AutoMap } from '@automapper/classes';
import { Product } from '../../products/entities/product.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Order } from './order.entity';

@Entity({ schema: 'public', name: 'order_details' })
export class OrderDetail {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  @AutoMap()
  id: number;

  @Column({
    type: 'bigint',
  })
  @AutoMap()
  product_id: number;

  @Column({
    type: 'bigint',
  })
  @AutoMap()
  order_id: number;

  @Column({
    type: 'int',
  })
  @AutoMap()
  quantity: number;

  @Column({
    type: 'int',
  })
  @AutoMap()
  amount: number;

  @ManyToOne(() => Product, (product) => product.orderDetails)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne(() => Order, (order) => order.orderDetails)
  @JoinColumn({ name: 'order_id' })
  order: Order;
}
