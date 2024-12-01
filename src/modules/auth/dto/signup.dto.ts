import {
  InputType,
  Field,
  ObjectType,
  OmitType,
  PickType,
} from '@nestjs/graphql';
import { User } from '../../../database/entities/user.entity';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class SignUpInput {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @Field(() => String)
  lastName: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @Field(() => String)
  email: string;

  @IsString()
  @IsNotEmpty()
  @Field(() => String)
  password: string;
}

@InputType()
export class LoginInput {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  password: string;
}
@InputType()
export class VerifyOtpInput extends PickType(LoginInput, ['email']) {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  otp: string;
}

@ObjectType()
export class SignUpRespone extends User {
  @Field()
  accessToken: string;

  @Field()
  otp: string;
}

@ObjectType()
export class LoginResponse extends PickType(SignUpRespone, [
  'accessToken',
  'id',
  'email',
] as const) {}
