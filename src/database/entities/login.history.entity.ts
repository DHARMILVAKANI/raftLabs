import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';

@ObjectType()
@Entity('UserLoginHistory')
export class UserLoginHistory extends BaseEntity {
  @Field(() => ID)
  id: string;

  @Field()
  @Column({ type: 'varchar' })
  accessToken: string;

  @OneToOne(() => User, (lh) => lh.loginHistory)
  @JoinColumn()
  user: User;
}
