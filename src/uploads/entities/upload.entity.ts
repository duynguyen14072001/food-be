import { AutoMap } from '@automapper/classes';
import { IsDate } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ schema: 'public', name: 'files' })
export class File {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  @AutoMap()
  id: number;

  @Column({
    type: 'varchar',
    length: 255,
  })
  @AutoMap()
  mime_type: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  @AutoMap()
  url: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  @AutoMap()
  original_name: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  @AutoMap()
  file_name: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  @AutoMap()
  type: string;

  @Column({
    type: 'integer',
  })
  @AutoMap()
  size: number;

  @CreateDateColumn()
  @AutoMap()
  created_at: Date;

  @Column({ nullable: true, type: 'timestamp' })
  @IsDate()
  @AutoMap()
  updated_at: Date;
}
