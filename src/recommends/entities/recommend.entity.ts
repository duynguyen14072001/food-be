import { AutoMap } from '@automapper/classes';
import { Product } from 'src/products/entities/product.entity';
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

@Entity({ schema: 'public', name: 'recommends' })
export class Recommend {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  @AutoMap()
  id: number;

  @Column({ type: 'bigint', unique: true })
  @AutoMap()
  product_id: number;

  @Column({ type: 'int' })
  @AutoMap()
  number: number;

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

  @AutoMap(() => Product)
  @ManyToOne(() => Product, (product) => product.recommends)
  @JoinColumn({ name: 'product_id' })
  product: Product;
}
