/* eslint-disable @typescript-eslint/indent */

import {
  Column, CreateDateColumn, Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn, UpdateDateColumn,
} from 'typeorm';
import { Partner } from './partner.entity';
import { Entertainment } from './entertaiment.entity';

@Entity()
export class Event {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @OneToOne(() => Partner)
  @JoinColumn({ name: 'partner_id' })
  partner: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  media: string;

  @Column()
  location: string;

  @Column()
  url: string;

  @Column('int4', {
    array: true,
    default: []
  })
  entertainment_tags: Entertainment;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
