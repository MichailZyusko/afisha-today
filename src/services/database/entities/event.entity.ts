/* eslint-disable @typescript-eslint/indent, import/no-cycle */

import {
  Column, CreateDateColumn, Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn, UpdateDateColumn,
} from 'typeorm';
import { Partner } from './partner.entity';
import { Entertainment } from './entertainment.entity';
import { EventFeedback } from './event_feedback.entity';

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => Partner, (partner) => partner.events)
  @JoinColumn({ name: 'partner_id' })
  partner: Partner;

  @OneToMany(() => EventFeedback, (feedback) => feedback.event)
  feedbacks: EventFeedback[];

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  media: string;

  @Column({ nullable: true })
  price: string;

  @Column()
  address: string;

  @Column({ nullable: true })
  location: string;

  @Column()
  schedule: string;

  @Column({
    default: false,
  })
  is_adult_only: boolean;

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
