import { Length } from "class-validator";
import { Field, InputType } from "type-graphql";

@InputType()
export class CreateTransportInput {
  @Field()
  @Length(1, 255)
  name: string

  @Field({ nullable: true })
  url: string

  @Field()
  startDate: Date

  @Field()
  endDate: Date
}