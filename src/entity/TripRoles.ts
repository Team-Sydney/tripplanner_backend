import { Field, ID, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Trip } from "./Trip";
import { User } from "./User";

@ObjectType()
@Entity()
export class TripRoles extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  @Field()
  role: string

  @ManyToOne(() => User, user => user.trips)
  @Field(() => User)
  user: Promise<User>

  @ManyToOne(() => Trip, trip => trip.tripUsers)
  @Field(() => Trip)
  trip: Promise<Trip>
}