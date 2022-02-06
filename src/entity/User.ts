import { Field, ID, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { TripRoles } from "./TripRoles";

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  @Field()
  firstName: string

  @Column()
  @Field()
  lastName: string

  @Column("text", { unique: true })
  @Field()
  email: string

  // nullable true for now since we're gonna be using Google Sign In
  // will delete this later
  @Column("text", { nullable: true })
  password: string

  @OneToMany(() => TripRoles, tripRoles => tripRoles.user, )
  @Field(() => [TripRoles])
  trips: Promise<TripRoles[]>
}