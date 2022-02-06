import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { Context } from "src/type/Context";
import { Service } from "typedi";
import { UserService } from "../../service/UserService";
import { UserResponse } from "./response/UserResponse";

@Service()
@Resolver()
export class LoginResolver {
  constructor(
    private readonly userService: UserService
  ) {}
  
  @Mutation(() => UserResponse, { nullable: true})
  async login(
    @Arg("email") email: string,
    @Arg("firstName", { nullable: true }) firstName: string,
    @Arg("lastName", { nullable: true }) lastName: string,
    @Ctx() ctx: Context
  ): Promise<UserResponse>{
    const user = await this.userService.findByEmail(email);

    if(!user) {
      const user = await this.userService.registerUser({email, firstName, lastName});

      ctx.req.session!.userId = user.id;

      return {
        user
      }
      // return {
      //   errors: [
      //     {
      //       field: "email",
      //       message: "An account with that email does not exist."
      //     }
      //   ]
      // };
    }

    ctx.req.session!.userId = user.id;

    return {
      user
    };
  }

}