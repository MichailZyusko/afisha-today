/* eslint-disable @typescript-eslint/indent */

import {
  Column, CreateDateColumn, Entity,
  JoinColumn, OneToOne, PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Event } from './event.entity';
import { EventState } from '../../../constants/enums';
import { ONE_WEEK_IN_MS } from '../../../constants/time';

@Entity('users_events')
export class UserEvent {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user_id: string;

  @OneToOne(() => Event)
  @JoinColumn({ name: 'event_id' })
  event_id: string;

  @Column({
    type: 'enum',
    enum: EventState,
    default: EventState.NOT_STARTED,
  })
  state: EventState;

  @Column({ nullable: true })
  finished_at: Date;

  @Column({ nullable: true })
  started_at: Date;

  @Column({ default: new Date(Date.now() + ONE_WEEK_IN_MS) })
  expired_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
