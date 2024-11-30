import {
  InputType,
  Field,
  ObjectType,
  OmitType,
  PickType,
} from '@nestjs/graphql';
import { User } from '../../../database/entities/user.entity';

@InputType()
export class SignUpInput {
  @Field(() => String)
  firstName: string;

  @Field(() => String)
  lastName: string;

  @Field(() => String)
  email: string;

  @Field(() => String)
  password: string;
}

@InputType()
export class LoginInput {
  @Field(() => String)
  email: string;

  @Field(() => String)
  password: string;
}

@ObjectType()
export class SignUpRespone extends User {
  @Field()
  accessToken: string;
}

@ObjectType()
export class LoginResponse extends PickType(SignUpRespone, [
  'accessToken',
  'id',
  'email',
] as const) {}
