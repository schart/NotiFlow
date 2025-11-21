import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class NotificationCreateInput {
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
