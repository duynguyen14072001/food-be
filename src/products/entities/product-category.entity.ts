import { AutoMap } from '@automapper/classes';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Product } from './product.entity';
import { Category } from 'src/categories/entities/category.entity';

@Entity({ schema: 'public', name: 'product_category' })
export class ProductCategory {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  @AutoMap()
  id: number;

  @Column()
  @AutoMap()
  category_id: number;

  @Column()
  @AutoMap()
  product_id: number;

  @ManyToOne(() => Product, (product) => product.productCategories)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne(() => Category, (category) => category.productCategories)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @CreateDateColumn()
  @AutoMap()
  created_at: Date;

  @UpdateDateColumn()
  @AutoMap()
  updated_at: Date;
}
