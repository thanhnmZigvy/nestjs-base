import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'crypto';

import { MyConfigService } from '@/modules/myConfigService/myConfig.service';
import { User } from '@/modules/user/user.entity';

import { UserService } from '../../user/user.service';
import { HashingService } from '../hashing/hashing.service';
import { RefreshTokenInput } from './dto/refresh-token.input';
import { SignInInput } from './dto/sign-in.input';
import { SignUpInput } from './dto/sign-up.input';

// type User = any;
export type PayloadToken = Pick<User, 'id' | 'email'>;
export type PayloadRefreshToken = Pick<User, 'id'> & { refreshTokenId: string };

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly configService: MyConfigService,
    private readonly jwtService: JwtService,
    private readonly hashingService: HashingService,

    private readonly userService: UserService,
    private readonly em: EntityManager,
  ) {}

  async signUp(signUpInput: SignUpInput) {
    const alreadyHasUser = await this.userService.findOne({
      email: signUpInput.email,
    });

    if (alreadyHasUser) {
      throw new UnauthorizedException('Email is Already Registered');
    }

    const user = this.userService.create(signUpInput);
    await this.em.flush();
    // await this.em.persistAndFlush(user);

    return { user };
  }

  async signIn(signInInput: SignInInput) {
    const user = await this.userService.findOne({
      email: signInInput.email,
    });
    if (!user) {
      throw new UnauthorizedException('User does not exists');
    }
    const isEqual = await this.hashingService.compare(
      signInInput.password,
      user.password,
    );
    if (!isEqual) {
      throw new UnauthorizedException('Password does not match');
    }

    return this.generateTokens(user);
  }

  async generateTokens(user: User) {
    const refreshTokenId = randomUUID();
    const [accessToken, refreshToken] = await Promise.all([
      this.signToken<Partial<PayloadToken>>(
        user.id,
        this.configService.data.jwt.accessTokenTtl,
        {
          email: user.email,
        },
      ),
      this.signToken<Partial<PayloadRefreshToken>>(
        user.id,
        this.configService.data.jwt.refreshTokenTtl,
        {
          refreshTokenId,
        },
      ),
    ]);
    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshTokens(refreshTokenInput: RefreshTokenInput) {
    const { id } = await this.jwtService.verifyAsync<PayloadRefreshToken>(
      refreshTokenInput.refreshToken,
      {
        secret: this.configService.data.jwt.secret,
      },
    );
    const user = await this.userService.findOneOrFail({
      id,
    });
    return this.generateTokens(user);
  }

  private async signToken<T>(userId: string, expiresIn: number, payload?: T) {
    return this.jwtService.signAsync(
      {
        id: userId,
        ...payload,
      },
      {
        expiresIn,
      },
    );
  }
}
