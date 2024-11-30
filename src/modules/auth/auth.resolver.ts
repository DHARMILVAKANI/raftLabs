import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import {
  LoginInput,
  LoginResponse,
  SignUpInput,
  SignUpRespone,
} from './dto/signup.dto';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => SignUpRespone)
  signUp(@Args('SignUpInput') data: SignUpInput) {
    return this.authService.signUp(data);
  }

  @Mutation(() => LoginResponse)
  login(@Args('LoginInput') data: LoginInput) {
    return this.authService.login(data);
  }
}
