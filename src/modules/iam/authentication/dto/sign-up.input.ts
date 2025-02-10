import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsString, MinLength } from 'class-validator';

@InputType()
export class SignUpInput {
  @IsString()
  @Field(() => String)
  firstName: string;

  @IsString()
  @Field(() => String)
  lastName: string;

  @IsEmail()
  @Field(() => String)
  email: string;

  @MinLength(8)
  @Field(() => String)
  password: string;
}
