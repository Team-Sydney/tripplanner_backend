import { Field, ID, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Trip } from "./Trip";
import { User } from "./User";

@ObjectType()
@Entity()
export class Hotel extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Field()
  name: string;

  @Column({ type: "text" })
  @Field()
  url: string;

  @Column({ type: 'timestamptz' })
  @Field()
  startDate: Date;

  @Column({ type: 'timestamptz' })
  @Field()
  endDate: Date;

  @ManyToMany(() => User)
  @JoinTable()
  @Field(() => [User])
  pendingApproval: User[]

  @ManyToMany(() => User)
  @JoinTable()
  @Field(() => [User])
  approvedBy: Promise<User[]>

  @ManyToOne(() => Trip)
  @JoinTable()
  trip: Trip
}