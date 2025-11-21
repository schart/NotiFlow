import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Notification {
  @Field(() => ID, { nullable: false })
  id!: number;

  @Field(() => String, { nullable: false })
  messageId!: string;

  @Field(() => String, { nullable: false })
  type!: string;

  @Field(() => String, { nullable: false })
  destination!: string;

  @Field(() => String, { nullable: false })
  subject!: string;

  @Field(() => String, { nullable: false })
  text!: string;
}
