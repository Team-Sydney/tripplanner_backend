import { Field, ID, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";

@ObjectType()
@Entity()
export class Transportation extends BaseEntity {
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

  @ManyToMany(() => User, { eager: true })
  @JoinTable()
  @Field(() => [User])
  pendingApproval: User[]

  @ManyToMany(() => User, { eager: true })
  @JoinTable()
  @Field(() => [User])
  approvedBy: User[]

  @Column()
  @Field(() => Boolean)    
  approved: boolean
}