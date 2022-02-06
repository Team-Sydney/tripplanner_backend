import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { Service } from "typedi";
import { Hotel } from "../../../entity/Hotel";
import { TripService } from "../../../service/TripService";
import { UserService } from "../../../service/UserService";
import { Context } from "../../../type/Context";
import { CreateHotelInput } from "./create/CreateHotelInput";

@Service()
@Resolver()
export class CreateHotelResolver {
  constructor(
    private readonly tripService: TripService,
    private readonly userService: UserService
  ) { }

  @Mutation(() => Hotel)
  async addHotel(
    @Arg("input") input: CreateHotelInput,
    @Arg("tripId") tripId: number,
    @Ctx() ctx: Context
  ): Promise<Hotel | undefined> {
    const user = await this.userService.findById(ctx.req.session!.userId);
    const trip = await this.tripService.findById(tripId);

    return await this.tripService.addHotel(trip, user, input);
  }
}