import { AutoMap } from '@automapper/classes';
import { Product } from 'src/products/entities/product.entity';
import { User } from 'src/users/users/entities/user.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ schema: 'public', name: 'carts' })
export class Cart {
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
  user_id: number;

  @Column({
    type: 'int',
  })
  @AutoMap()
  quantity: number;

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

  @ManyToOne(() => Product, (product) => product.carts)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne(() => User, (user) => user.carts)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
