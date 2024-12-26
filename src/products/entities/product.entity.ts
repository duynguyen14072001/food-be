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
}
