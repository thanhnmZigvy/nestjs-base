import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Response } from 'express';

import { User } from '@/entities/user.entity';
import { getCurrentUser } from '@/utils/request-context';
import { objectKeys } from '@/utils/typescriptEnhance';

import { AuthenticationService } from './authentication.service';
import { Auth } from './decorators/auth.decorator';
import LoginResponse from './dto/login.dto';
import { RefreshTokenInput } from './dto/refresh-token.input';
import { SignInInput } from './dto/sign-in.input';
import SignUpResponse from './dto/sign-up.dto';
import { SignUpInput } from './dto/sign-up.input';
import { AuthType } from './enums/auth-type.enum';

@Auth(AuthType.None)
@Resolver(() => User)
export class AuthenticationResolver {
  constructor(private readonly authService: AuthenticationService) {}

  @Mutation(() => LoginResponse, { name: 'signIn' })
  async signIn(
    @Args({ name: 'signInInput', type: () => SignInInput })
    signInInput: SignInInput,
    @Context('res') res: Response,
  ) {
    // return this.authService.signIn(signInInput);
    const result = await this.authService.signIn(signInInput);
    objectKeys(result).forEach((key) => {
      res.cookie(key, result[key], {
        maxAge: 10 * 365 * 24 * 60 * 60 * 1000, // 10 years in milliseconds

        // secure: true,
        // httpOnly: true,
        // sameSite: true,
      });
    });

    return result;
  }

  @Mutation(() => SignUpResponse, { name: 'signUp' })
  async signUp(
    @Args({ name: 'signUpInput', type: () => SignUpInput })
    signUpInput: SignUpInput,
  ) {
    return this.authService.signUp(signUpInput);
  }

  /**
   * Handles refreshing of authentication tokens.
   * @param refreshTokenInput - The input containing the refresh token.
   * @param res - The response object for setting cookies.
   * @returns The login response containing new access and refresh tokens.
   */
  @Mutation(() => LoginResponse, { name: 'refreshTokens' })
  async refreshTokens(
    @Args({ name: 'refreshTokenInput', type: () => RefreshTokenInput })
    refreshTokenInput: RefreshTokenInput,
    @Context('res') res: Response,
  ) {
    const result = await this.authService.refreshTokens(refreshTokenInput);
    objectKeys(result).forEach((key) => {
      res.cookie(key, result[key], {
        maxAge: 10 * 365 * 24 * 60 * 60 * 1000, // 10 years in milliseconds

        // secure: true,
        // httpOnly: true,
        // sameSite: true,
      });
    });

    return result;
  }

  // /**
  //  * Retrieves the currently authenticated user.
  //  * @returns The authenticated user object if present, or `null` if not authenticated.
  //  * @throws {UnauthorizedException} If authentication fails (handled by the `@Auth` decorator).
  //  */
  // @Query(() => String, { name: 'me', nullable: true })
  // @Auth(AuthType.Bearer)
  // async me() {
  //   return 'Hello World!';
  // }
  /**
   * Retrieves the currently authenticated user.
   * @returns The authenticated user object if present, or `null` if not authenticated.
   * @throws {UnauthorizedException} If authentication fails (handled by the `@Auth` decorator).
   */
  @Query(() => User, { name: 'me', nullable: true })
  @Auth(AuthType.Bearer)
  async me() {
    return getCurrentUser();
  }
}
