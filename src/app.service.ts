import { Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class AppService {
  @Query(() => String)
  getHello() {
    return 'Hello World!';
  }
}
