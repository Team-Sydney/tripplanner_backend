import { Query, Resolver } from "type-graphql";

@Resolver()
export class StarterResolver {

  @Query(() => String)
  async hello() {
    return "Hello World!";
  }
}