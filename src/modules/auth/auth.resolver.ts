import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import {
  LoginInput,
  LoginResponse,
  SignUpInput,
  SignUpRespone,
} from './dto/signup.dto';
import { Public } from 'src/decorators/public.decorator';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Mutation(() => SignUpRespone)
  signUp(@Args('SignUpInput') data: SignUpInput) {
    return this.authService.signUp(data);
  }

  @Public()
  @Mutation(() => LoginResponse)
  login(@Args('LoginInput') data: LoginInput) {
    return this.authService.login(data);
  }
}
