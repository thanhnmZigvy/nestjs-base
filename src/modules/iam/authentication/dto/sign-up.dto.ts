import { Field, ObjectType } from '@nestjs/graphql';

import { User } from '@/entities/user.entity';

@ObjectType()
export default class SignUpResponse {
  @Field(() => User)
  user: User;
}
