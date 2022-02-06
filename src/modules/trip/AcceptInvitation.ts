import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { Service } from "typedi";
import { TripService } from "../../service/TripService";
import { UserService } from "../../service/UserService";
import { Context } from "../../type/Context";

@Service()
@Resolver()
export class AcceptInviteResolver {
  constructor(
    private readonly tripService: TripService,
    private readonly userService: UserService
  ) {}

  @Mutation(() => Boolean)
  async acceptInvitation(
    @Ctx() ctx: Context,
    @Arg("token") token: string
  ): Promise<boolean> {
    const user = await this.userService.findById(ctx.req.session!.userId);

    return await this.tripService.acceptInvitation(token, user);
  }
}