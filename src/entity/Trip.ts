import { Field, ID, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@ObjectType()
@Entity()
export class Trip extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Field()
  title: string;
  
  @Column()
  @Field()
  destination: string;

  @Column({ type: 'timestamptz' })
  @Field()
  startDate: Date

  @Column({ type: 'timestamptz' })
  @Field()
  endDate: Date
}