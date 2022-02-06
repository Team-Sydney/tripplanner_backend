
import { Query, Resolver } from "type-graphql";
import { Service } from "typedi";
import { Trip } from "../../entity/Trip";
import { TripService } from "../../service/TripService";

@Service()
@Resolver()
export class GetTripsResolver {
  constructor(
    private readonly tripService: TripService,
  ) {}

  @Query(() => [Trip])
  async trips(): Promise<Trip[] | undefined> {
    const trips = await this.tripService.getAll();

    return trips;
  }
}