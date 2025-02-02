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
import { Product } from './product.entity';
import { AutoMap } from '@automapper/classes';

@Entity({ schema: 'public', name: 'product_images' })
export class ProductImages {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  @AutoMap()
  id: number;

  @Column({
    type: 'bigint',
  })
  @AutoMap()
  product_id: number;

  @Column({
    type: 'varchar',
    length: 255,
  })
  @AutoMap()
  image_url: string;

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

  @ManyToOne(() => Product, (product) => product.productImages)
  @JoinColumn({ name: 'product_id' })
  product: Product;
}
