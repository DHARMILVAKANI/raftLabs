import { Column, Entity, OneToMany, OneToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Field, ID, ObjectType, DateScalarMode } from '@nestjs/graphql';
import { UserLoginHistory } from './login.history.entity';
import { Task } from 'src/database/entities/task.entity';

@ObjectType()
@Entity('User')
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

  @Column({ type: 'varchar' })
  password: string;

  @Column({ type: 'varchar', nullable: true })
  @Field({ nullable: true })
  dob?: string;

  @Column({ type: 'varchar', nullable: true })
  @Field({ nullable: true })
  phoneNumber?: string;

  @OneToOne(() => UserLoginHistory, (u) => u.user)
  loginHistory: UserLoginHistory;

  @OneToMany(() => Task, (tk) => tk.user)
  tasks: Task[];
}
