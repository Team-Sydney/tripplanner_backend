import { Field, ID, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@ObjectType()
@Entity()
export default class Hotel extends BaseEntity {
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
}