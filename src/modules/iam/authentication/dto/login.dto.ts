import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export default class LoginResponse {
  @Field(() => String)
  accessToken: string;

  @Field(() => String)
  refreshToken: string;
}
