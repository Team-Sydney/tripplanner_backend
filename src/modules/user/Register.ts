import { Arg, Mutation, Resolver } from "type-graphql";
import { User } from "../../entity/User";
import { RegisterInput } from "./register/RegisterInput";
import { Service } from "typedi";
import { UserService } from "../../service/UserService";

@Service()
@Resolver()
export class RegisterResolver {
  constructor(
    private readonly userService: UserService
  ) {}

  @Mutation(() => User)
  async register(
    @Arg("data") {email, firstName, lastName} : RegisterInput
  ): Promise<User> {
    return await this.userService.registerUser({email, firstName, lastName});
  }

}