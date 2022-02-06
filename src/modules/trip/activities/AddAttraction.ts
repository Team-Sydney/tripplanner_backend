import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { Service } from "typedi";
import { Attraction } from "../../../entity/Attraction";
import { TripService } from "../../../service/TripService";
import { UserService } from "../../../service/UserService";
import { Context } from "../../../type/Context";
import { CreateAttractionInput } from "./create/CreateAttractionInput";

@Service()
@Resolver()
export class CreateAttractionResolver {
  constructor(
    private readonly tripService: TripService,
    private readonly userService: UserService
  ) {}

  @Mutation(() => Attraction)
  async addAttraction(
    @Arg("input") input: CreateAttractionInput,
    @Arg("tripId") tripId: number,
    @Ctx() ctx: Context
  ): Promise<Attraction | undefined> {
    const user = await this.userService.findById(ctx.req.session!.userId);
    const trip = await this.tripService.findById(tripId);

    return await this.tripService.addAttraction(trip, user, input);
  }
}