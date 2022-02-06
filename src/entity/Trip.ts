import { Field, ID, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, JoinTable, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { TripRoles } from "./TripRoles";
@ObjectType()
@Entity()
export class Trip extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  @Field()
  title: string
  
  @Column()
  @Field()
  destination: string

  @Column({ type: 'timestamptz' })
  @Field()
  startDate: Date

  @Column({ type: 'timestamptz' })
  @Field()
  endDate: Date

  @OneToMany(() => TripRoles, tripRoles => tripRoles.trip)
  @JoinTable()
  @Field(() => [TripRoles])
  tripUsers: Promise<TripRoles[]>
}