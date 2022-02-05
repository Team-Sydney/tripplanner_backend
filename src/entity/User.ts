import { Field, ID, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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

  // nullable true
  @Column("text", { nullable: true })
  password: string
}