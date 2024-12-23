import { AutoMap } from '@automapper/classes';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

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
    type: 'varchar',
    length: 255,
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
}
