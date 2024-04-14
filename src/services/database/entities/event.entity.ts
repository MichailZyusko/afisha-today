/* eslint-disable @typescript-eslint/indent */

import {
  Column, CreateDateColumn, Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn, UpdateDateColumn,
} from 'typeorm';
import { Partner } from './partner.entity';
import { Entertainment } from './entertainment.entity';
import { Age } from '../../../constants/enums';

@Entity()
export class Event {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => Partner, (partner) => partner.events)
  @JoinColumn({ name: 'partner_id' })
  partner: Partner;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  media: string;

  @Column({ nullable: true })
  price: string;

  @Column()
  location: string;

  @Column()
  schedule: string;

  @Column({
    type: 'enum',
    enum: Age,
    nullable: true,
  })
  age: Age;

  @Column()
  url: string;

  @Column('int4', {
    array: true,
    default: [],
  })
  entertainment_tags: Entertainment;

  @Column()
  started_at: Date;

  @Column()
  expired_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
