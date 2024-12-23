import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { AutoMap } from '@automapper/classes';

export enum AdminRole {
  ADMIN = 1,
  EDITOR = 2,
}

@Entity({ schema: 'public', name: 'admins' })
export class Admin {
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
  password: string;

  @Column({
    type: 'enum',
    enum: AdminRole,
    default: AdminRole.EDITOR,
  })
  @AutoMap()
  role: number;

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
