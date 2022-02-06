import { CreateHotelInput } from "src/modules/trip/activities/create/CreateHotelInput";
import { Service } from "typedi";
import { Repository } from "typeorm";
import { InjectRepository } from "typeorm-typedi-extensions";
import { v4 } from "uuid";
import { Attraction } from "../entity/Attraction";
import { Hotel } from "../entity/Hotel";
import { Transportation } from "../entity/Transportation";
import { Trip } from "../entity/Trip";
import { TripRoles } from "../entity/TripRoles";
import { User } from "../entity/User";
import { CreateAttractionInput } from "../modules/trip/activities/create/CreateAttractionInput";
import { CreateTransportInput } from "../modules/trip/activities/create/CreateTransportInput";
import { CreateTripInput } from "../modules/trip/create/CreateTripInput";
import { redis } from "../redis";

@Service()
export class TripService {

  @InjectRepository(Trip)
  private tripRepository: Repository<Trip>;

  @InjectRepository(TripRoles)
  private tripRoleRepository: Repository<TripRoles>;

  @InjectRepository(Attraction)
  private attractionRepository: Repository<Attraction>;

  @InjectRepository(Transportation)
  private transportationRepository: Repository<Transportation>;

  @InjectRepository(Hotel)
  private hotelRepository: Repository<Attraction>;


  async getAll(): Promise<Trip[]> {
    return await this.tripRepository.find();
  }

  async findById(id: number) {
    const trip = await this.tripRepository.findOne(id);

    if (!trip) {
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
    if (await this.isCreator(trip, creatorUser) || await !this.isMember(trip, userToInvite)) {
      const token = v4();
      await redis.set("trip-invite-" + token, trip.id, "ex", 60 * 60 * 24);
      console.log("Token to accept invite: trip-invite-" + token);
      console.log("Trip ID to accept invite:" + await redis.get("trip-invite-" + token));
    }

    return true;
  }


  async acceptInvitation(token: string, user: User): Promise<boolean> {
    const tripId = await redis.get(token);

    if (!tripId) {
      return false;
    } else {
      const trip = await this.tripRepository.findOne(tripId);
      await redis.del("trip-invite-" + token);

      if (trip) {
        const tripRole = new TripRoles();
        tripRole.role = "Member";
        tripRole.user = Promise.resolve(user);
        tripRole.trip = Promise.resolve(trip);

        await this.tripRoleRepository.save(tripRole);
      }
    }

    return true;
  }

  /*
  Add activity items to a trip
  */

  async findAttractionById(id: number): Promise<Attraction> {
    const attraction = await this.attractionRepository.findOne(id);
    
    if(!attraction) {
      throw new Error("Attraction not found");
    }

    return attraction;
  }

  async addUsersToApprovers(trip: Trip): Promise<User[]> {
    const users = [] as any;

    for(const tripRole of await trip.tripUsers) {
      users.push(await tripRole.user);
    }

    return users;
  }

  async approveAttraction(attraction: Attraction, user: User): Promise<boolean> {
    if(attraction.pendingApproval.find((user: User) => user.id === user.id)) {
      let index = attraction.pendingApproval.map(function (user) {
        return user.id
      }).indexOf(user.id);

      attraction.pendingApproval.splice(index, 1);
      attraction.approvedBy = Promise.resolve([... await attraction.approvedBy, user]);
      await this.attractionRepository.save(attraction);
      
      return true;
    }

    return false;
  }

  // If Member check means that the user can only be a member of a trip to add an attraction
  async addAttraction(trip: Trip, user: User, attraction: CreateAttractionInput): Promise<Attraction | undefined> {
    if (await this.isMember(trip, user) || await this.isCreator(trip, user)) {
      const newAttraction = new Attraction();
      newAttraction.name = attraction.name;
      newAttraction.url = attraction.url;
      newAttraction.startDate = attraction.startDate;
      newAttraction.endDate = attraction.endDate;

      // Add trip users to pending approval list
      newAttraction.pendingApproval = await this.addUsersToApprovers(trip);

      console.log("Users: ");
      console.log(newAttraction.pendingApproval);

      trip.attractions = Promise.resolve([...await trip.attractions, newAttraction]);

      await this.attractionRepository.save(newAttraction);
      await this.tripRepository.save(trip);
      
      return newAttraction;
    }

    return undefined;
  }

  /**
   * Adds a new transportation to trip
   * @param trip The trip to add the transportation to
   * @param user The user who is adding the transportation
   * @param transportation The transportation to add
   * @returns The newly created transportation
   */
  async addTransportation(trip: Trip, user: User, transportation: CreateTransportInput): Promise<Transportation | undefined> {
    if (await this.isMember(trip, user) || await this.isCreator(trip, user)) {
      const newTransportation = new Transportation();
      newTransportation.name = transportation.name;
      newTransportation.url = transportation.url;
      newTransportation.startDate = transportation.startDate;
      newTransportation.endDate = transportation.endDate;

      // Add trip users to pending approval list
      newTransportation.pendingApproval = await this.addUsersToApprovers(trip);

      trip.transportations = Promise.resolve([...await trip.transportations, newTransportation]);

      await this.transportationRepository.save(newTransportation);
      await this.tripRepository.save(trip);
      
      return newTransportation;
    }

    return undefined;
  }  

  /**
   * Approve transportation for trip
   * @param transportation The transportation to approve
   * @param user The user who is approving the transportation
   * @returns Whether the user approved the transportation
   */
  async approveTransportation(transportation: Transportation, user: User): Promise<boolean> {
    if(transportation.pendingApproval.find((user: User) => user.id === user.id)) {
      let index = transportation.pendingApproval.map(function (user) {
        return user.id
      }).indexOf(user.id);

      transportation.pendingApproval.splice(index, 1);
      transportation.approvedBy = Promise.resolve([... await transportation.approvedBy, user]);
      await this.transportationRepository.save(transportation);
      
      return true;
    }

    return false;
  }

  /**
   * Adds a new hotel to the trip
   * @param trip A trip to add a user to
   * @param user The user to add to the trip
   * @param hotel The hotel to add to the trip
   * @returns The hotel that was added to the trip
   */
  async addHotel(trip: Trip, user: User, hotel: CreateHotelInput): Promise<Hotel | undefined> {
    if (await this.isMember(trip, user) || await this.isCreator(trip, user)) {
      const newHotel = new Hotel();
      newHotel.name = hotel.name;
      newHotel.url = hotel.url;
      newHotel.startDate = hotel.startDate;
      newHotel.endDate = hotel.endDate;

      trip.hotels = Promise.resolve([...await trip.hotels, newHotel]);

      await this.hotelRepository.save(newHotel);
      await this.tripRepository.save(trip);

      console.log("Testing")
      console.log(newHotel)

      return newHotel;
    }

    return undefined;
  }
}