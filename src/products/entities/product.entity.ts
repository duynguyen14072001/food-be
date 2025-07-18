import { AutoMap } from '@automapper/classes';
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
import { ProductCategory } from './product-category.entity';
import { OrderDetail } from '../../orders/entities/order-detail.entity';
import { Recommend } from 'src/recommends/entities/recommend.entity';
import { ProductImages } from './product-images.entity';
import { Cart } from 'src/carts/entities/cart.entity';
import { Review } from 'src/reviews/entities/review.entity';

@Entity({ schema: 'public', name: 'products' })
export class Product {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  @AutoMap()
  id: number;

  @Column({
    type: 'varchar',
    length: 255,
  })
  @AutoMap()
  name: string;

  @Column({
    type: 'varchar',
    length: 255,
    unique: true,
  })
  @AutoMap()
  slug: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  @AutoMap()
  image_url: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  @AutoMap()
  description: string;

  @Column({
    type: 'float',
  })
  @AutoMap()
  price: number;

  @Column({
    type: 'tinyint',
    default: 0,
  })
  @AutoMap()
  show_flag: number;

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

  @OneToMany(
    () => ProductCategory,
    (productCategory) => productCategory.product,
  )
  @JoinColumn({ name: 'product_id' })
  productCategories: ProductCategory[];

  @OneToMany(() => OrderDetail, (orderDetail) => orderDetail.product)
  @JoinColumn({ name: 'product_id' })
  orderDetails: OrderDetail[];

  @AutoMap(() => Recommend)
  @OneToMany(() => Recommend, (recommend) => recommend.product)
  @JoinColumn({ name: 'product_id' })
  recommends: Recommend[];

  @OneToMany(() => ProductImages, (productImages) => productImages.product)
  @JoinColumn({ name: 'product_id' })
  productImages: ProductImages[];

  @OneToMany(() => Cart, (cart) => cart.product)
  @JoinColumn({ name: 'product_id' })
  carts: Cart[];

  @OneToMany(() => Review, (review) => review.product)
  @JoinColumn({ name: 'product_id' })
  reviews: Review[];
}
