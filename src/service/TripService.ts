import { Service } from "typedi";
import { Repository } from "typeorm";
import { InjectRepository } from "typeorm-typedi-extensions";
import { v4 } from "uuid";
import { Trip } from "../entity/Trip";
import { TripRoles } from "../entity/TripRoles";
import { User } from "../entity/User";
import { CreateTripInput } from "../modules/trip/create/CreateTripInput";
import { redis } from "../redis";

@Service()
export class TripService {

  @InjectRepository(Trip)
  private tripRepository: Repository<Trip>; 

  @InjectRepository(TripRoles)
  private tripRoleRepository: Repository<TripRoles>; 

  async getAll(): Promise<Trip[]> {
    return await this.tripRepository.find();
  }
   
  async findById(id: number) {
    const trip = await this.tripRepository.findOne(id);

    if(!trip) {
      throw new Error("Trip not found");
    }

    return await trip;
  }

  async isCreator(trip: Trip, user: User): Promise<boolean> {
    const tripRole = await this.tripRoleRepository.findOne({
      where: {
        user: user,
        trip: trip,
        role: "Creator",
      },
    });

    return tripRole !== undefined;
  }

  async createTrip(user: User, input: CreateTripInput): Promise<Trip> {
    const trip = new Trip();

    trip.title = input.title;
    trip.destination = input.destination;
    trip.startDate = input.startDate;
    trip.endDate = input.endDate;

    const tripRole = new TripRoles();
    tripRole.role = "Creator";
    tripRole.user = Promise.resolve(user);
    tripRole.trip = Promise.resolve(trip);

    console.log(trip);
    
    await this.tripRepository.save(trip);
    await this.tripRoleRepository.save(tripRole);

    return trip;
  } 

  async isMember(trip: Trip, user: User): Promise<boolean> {
    const tripRole = await this.tripRoleRepository.findOne({
      where: {
        user: user,
        trip: trip,
        role: "Member",
      },
    });

    return tripRole !== undefined;
  }

  async sendInvitationToMember(trip: Trip, creatorUser: User, userToInvite: User): Promise<boolean> {
    if(await this.isCreator(trip, creatorUser) || await !this.isMember(trip, userToInvite)) {  
      const token = v4();
      await redis.set("trip-invite-" + token, trip.id, "ex", 60 * 60 * 24);
      console.log("Token to accept invite: trip-invite-" + token);
      console.log("Trip ID to accept invite:" + await redis.get("trip-invite-" + token));
    }

    return true;
  }

  async acceptInvitation(token: string, user: User): Promise<boolean> {
    const tripId = await redis.get(token);

    if(!tripId) {
      return false;
    } else {
      const trip = await this.tripRepository.findOne(tripId);
      await redis.del("trip-invite-" + token);

      if(trip) {
        const tripRole = new TripRoles();
        tripRole.role = "Member";
        tripRole.user = Promise.resolve(user);
        tripRole.trip = Promise.resolve(trip);

        await this.tripRoleRepository.save(tripRole);
      }
    }

    return true;
  }

}