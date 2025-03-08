import { AutoMap } from '@automapper/classes';
import { User } from '../../users/users/entities/user.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OrderDetail } from './order-detail.entity';

@Entity({ schema: 'public', name: 'orders' })
export class Order {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  @AutoMap()
  id: number;

  @Column({
    type: 'bigint',
  })
  @AutoMap()
  user_id: number;

  @Column({
    type: 'tinyint',
    comment:
      '1-Đang chờ, 2-Đang giao, 3-Giao hàng thành công, 4-Giao hàng thất bại',
  })
  @AutoMap()
  status: number;

  @Column({
    type: 'varchar',
    length: 255,
  })
  @AutoMap()
  shipping_address: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  @AutoMap()
  note: string;

  @Column({ type: 'timestamp', nullable: true })
  @AutoMap()
  order_date: Date;

  @Column({
    type: 'tinyint',
    comment: '1-Thanh toán khi giao hàng, 2-Thanh toán online,',
  })
  @AutoMap()
  payment_method: number;

  @Column({
    type: 'tinyint',
    comment: '1-Đã thanh toán, 2-Chưa thanh toán, 3-Thanh toán thất bại',
  })
  @AutoMap()
  payment_status: number;

  @CreateDateColumn()
  @AutoMap()
  created_at: Date;

  @UpdateDateColumn()
  @AutoMap()
  updated_at: Date;

  @BeforeInsert()
  CreatedDate() {
    this.created_at = new Date();
    this.updated_at = new Date();
  }

  @BeforeUpdate()
  updatedDate() {
    this.updated_at = new Date();
  }

  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => OrderDetail, (orderDetail) => orderDetail.order)
  @JoinColumn({ name: 'order_id' })
  orderDetails: OrderDetail[];
}
