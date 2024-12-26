import { AutoMap } from '@automapper/classes';
import { ProductCategory } from 'src/products/entities/product-category.entity';
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

@Entity({ schema: 'public', name: 'categories' })
export class Category {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  @AutoMap()
  id: number;

  @Column({
    type: 'varchar',
    length: 255,
  })
  @AutoMap()
  name: string;

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

  @AutoMap(() => ProductCategory)
  @OneToMany(
    () => ProductCategory,
    (productCategory) => productCategory.category,
  )
  @JoinColumn({ name: 'category_id' })
  productCategories: ProductCategory[];
}
