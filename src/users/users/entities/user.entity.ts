import { AutoMap } from '@automapper/classes';
import { Order } from '../../../orders/entities/order.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Cart } from 'src/carts/entities/cart.entity';

@Entity({ schema: 'public', name: 'users' })
export class User {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  @AutoMap()
  id: number;

  @Column({
    type: 'varchar',
    length: 255,
    unique: true,
  })
  @AutoMap()
  mail_address: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  @AutoMap()
  name: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  @AutoMap()
  image_url: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  @AutoMap()
  password: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  @AutoMap()
  phone_number: string;

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

  @AutoMap(() => Order)
  @OneToMany(() => Order, (order) => order.user)
  @JoinColumn({ name: 'user_id' })
  orders: Order[];

  @AutoMap(() => Cart)
  @OneToMany(() => Cart, (cart) => cart.user)
  @JoinColumn({ name: 'user_id' })
  carts: Cart[];
}
