import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { Service } from "typedi";
import { Transportation } from "../../../entity/Transportation";
import { TripService } from "../../../service/TripService";
import { UserService } from "../../../service/UserService";
import { Context } from "../../../type/Context";
import { CreateTransportInput } from "./create/CreateTransportInput";

@Service()
@Resolver()
export class CreateTransportResolver {
  constructor(
    private readonly tripService: TripService,
    private readonly userService: UserService
  ) { }

  @Mutation(() => Transportation)
  async addTransportation(
    @Arg("input") input: CreateTransportInput,
    @Arg("tripId") tripId: number,
    @Ctx() ctx: Context
  ): Promise<Transportation | undefined> {
    const user = await this.userService.findById(ctx.req.session!.userId);
    const trip = await this.tripService.findById(tripId);

    return await this.tripService.addTransportation(trip, user, input);
  }
}