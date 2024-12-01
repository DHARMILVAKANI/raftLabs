import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql'; // Import for GraphQL

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const gqlContext = GqlExecutionContext.create(ctx); // Create the GraphQL execution context
    const request = gqlContext.getContext().req; // Get the request object from the GraphQL context
    return { userId: request.userId, email: request.email };
  },
);
