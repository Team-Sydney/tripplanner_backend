import { Length } from "class-validator";
import { Field, InputType } from "type-graphql";

@InputType()
export class CreateTripInput {
  @Field()
  @Length(1, 255)
  title: string

  @Field()
  @Length(1, 255)
  destination: string

  @Field()
  startDate: Date

  @Field()
  endDate: Date
}