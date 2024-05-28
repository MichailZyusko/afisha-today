/* eslint-disable @typescript-eslint/indent, import/no-cycle */

import {
  Column, CreateDateColumn, Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Event } from './event.entity';

@Entity('events_feedbacks')
export class EventFeedback {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => Event, (event) => event.feedbacks)
  @JoinColumn({ name: 'event_id' })
  event: Event;

  @ManyToOne(() => User, (user) => user.feedbacks)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ nullable: true })
  is_liked: boolean;

  @Column({
    nullable: true,
  })
  comment: string;

  @Column({
    nullable: true,
  })
  photo_proof: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
