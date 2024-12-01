import {
  InputType,
  Int,
  Field,
  PickType,
  OmitType,
  ID,
  PartialType,
} from '@nestjs/graphql';
import { User } from 'src/database/entities/user.entity';
import { SignUpInput } from 'src/modules/auth/dto/signup.dto';

@InputType()
export class UpdateProfileInput extends PartialType(
  OmitType(SignUpInput, ['email', 'password']),
) {
  @Field({ nullable: true })
  dob?: string;

  @Field({ nullable: true })
  phoneNumber?: string;
}
