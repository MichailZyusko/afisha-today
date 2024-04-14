/* eslint-disable @typescript-eslint/indent */

import {
  Column, CreateDateColumn, Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Age, Busyness } from '../../../constants/enums';

@Entity()
export class User {
  @PrimaryColumn()
  id: number;

  @Column()
  chat_id: string;

  @Column()
  user_name: string;

  @Column()
  full_name: string;

  @Column({
    nullable: true,
  })
  phone: string;

  @Column({
    nullable: true,
  })
  sex: boolean;

  @Column({
    type: 'enum',
    enum: Age,
    nullable: true,
  })
  age: Age;

  @Column({
    type: 'enum',
    enum: Busyness,
    nullable: true,
  })
  busyness: Busyness;

  @Column('int4', {
    array: true,
    default: [],
  })
  entertainment_preference: number[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
