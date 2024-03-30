/* eslint-disable @typescript-eslint/indent */

import {
  Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Event } from './event.entity';
import { EventState } from '../../../constants/enums';

@Entity()
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
  })
  state: EventState;

  @Column()
  expired_at: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
