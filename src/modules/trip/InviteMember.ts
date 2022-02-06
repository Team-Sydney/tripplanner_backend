import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { Service } from "typedi";
import { TripService } from "../../service/TripService";
import { UserService } from "../../service/UserService";
import { Context } from "../../type/Context";

@Service()
@Resolver()
export class InviteMemberResolver {
  constructor(
    private readonly tripService: TripService,
    private readonly userService: UserService
  ) {}

  @Mutation(() => Boolean)
  async inviteMember(
    @Ctx() ctx: Context,
    @Arg("tripId") tripId: number,
    @Arg("email") email: string,
  ): Promise<boolean> {
    const userToInvite = await this.userService.findByEmail(email);
    const creatorUser = await this.userService.findById(ctx.req.session!.userId);
    const trip = await this.tripService.findById(tripId);

    return await this.tripService.sendInvitationToMember(trip, creatorUser, userToInvite);
  }
}