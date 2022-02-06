import { Length } from "class-validator";
import { Field, InputType } from "type-graphql";

@InputType()
export class CreateAttractionInput {
  @Field()
  @Length(1, 255)
  name: string

  @Field()
  url: string

  @Field()
  startDate: Date

  @Field()
  endDate: Date
}