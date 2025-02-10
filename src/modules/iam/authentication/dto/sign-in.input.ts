import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, MinLength } from 'class-validator';

@InputType()
export class SignInInput {
  @IsEmail()
  @Field(() => String)
  email: string;

  @MinLength(8)
  @Field(() => String)
  password: string;
}
