import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { Service } from "typedi";
import { TripService } from "../../service/TripService";
import { CreateTripInput } from "./create/CreateTripInput";
import { Context } from "../../type/Context";
import { UserService } from "../../service/UserService";
import { Trip } from "../../entity/Trip";

@Service()
@Resolver()
export class CreateTripResolver {
  constructor(
    private readonly tripService: TripService,
    private readonly userService: UserService
  ) {}

  @Mutation(() => Trip)
  async createTrip(
    @Arg("input") input: CreateTripInput,
    @Ctx() ctx: Context
  ): Promise<Trip | undefined> {
    if (!ctx.req.session!.userId) {
      return undefined;
    }

    const user = await this.userService.findById(ctx.req.session!.userId);

    console.log("User being added?")
    console.log(user)

    return await this.tripService.createTrip(user, input);
  }
}