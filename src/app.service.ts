import { Query, Resolver } from '@nestjs/graphql';
import { Public } from 'src/decorators/public.decorator';

@Public()
@Resolver()
export class AppService {
  @Query(() => String)
  getHello() {
    return 'Hello World!';
  }
}
