import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import get from 'lodash/get';

import { MyConfigService } from '@/modules/myConfigService/myConfig.service';
import { setCurrentUser } from '@/utils/request-context';

import { UserRepository } from '../../../user/user.repository';
import { PayloadToken } from '../../authentication/authentication.service';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,

    private readonly configService: MyConfigService,

    private readonly userRepository: UserRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req as Request;
    // const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const { id } = await this.jwtService.verifyAsync<PayloadToken>(token, {
        secret: this.configService.data.jwt.secret,
      });
      const user = await this.userRepository.findOneOrFail({
        id,
      });
      setCurrentUser(user);
    } catch (e) {
      throw new UnauthorizedException(`Authentication failed: ${e.message}`);
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const token = get(request.headers.authorization?.split(' ') ?? [], '1');

    return token;
  }
}
