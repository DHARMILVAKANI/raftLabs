import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from 'src/database/entities/base.entity';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { User } from 'src/database/entities/user.entity';

@ObjectType()
@Entity('Task')
export class Task extends BaseEntity {
  @Field(() => ID)
  id: string;

  @Column({ type: 'varchar' })
  @Field(() => String)
  title: string;

  @Column({ type: 'varchar' })
  @Field(() => String)
  description: string;

  @ManyToOne(() => User, (u) => u.tasks)
  @JoinColumn()
  user: User;
}
