import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Field, ID, ObjectType } from '@nestjs/graphql';

@Entity('User')
@ObjectType()
export class User extends BaseEntity {
  @Field(() => ID)
  id: string;

  @Column({ type: 'varchar' })
  @Field()
  firstName: string;

  @Column({ type: 'varchar' })
  @Field()
  lastName: string;

  @Column({ type: 'varchar', unique: true })
  @Field()
  email: string;

  @Column({ type: 'varchar', nullable: true })
  @Field({ nullable: true })
  dob?: string;

  @Column({ type: 'varchar', nullable: true })
  @Field({ nullable: true })
  phoneNumber?: string;
}
