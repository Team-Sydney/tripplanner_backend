import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { Service } from "typedi";
import { TripService } from "../../../service/TripService";
import { UserService } from "../../../service/UserService";
import { Context } from "../../../type/Context";

@Service()
@Resolver()
export class ApproveAttraction {
  constructor(
    private readonly tripService: TripService,
    private readonly userService: UserService
  ) {}

  @Mutation(() => Boolean)
  async approveAttraction(
    @Arg("attractionId") attractionId: number,
    @Ctx() ctx: Context
  ): Promise<boolean> {
    const user = await this.userService.findById(ctx.req.session!.userId);
    const attraction = await this.tripService.findAttractionById(attractionId);

    return await this.tripService.approveAttraction(attraction, user);
  }
}