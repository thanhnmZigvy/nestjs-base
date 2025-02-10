import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { AUTH_TYPE_KEY } from '../../authentication/decorators/auth.decorator';
import { AuthType } from '../../authentication/enums/auth-type.enum';
import { AccessTokenGuard } from '../access-token/access-token.guard';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  /**
   * Default authentication type used when no specific type is defined.
   */
  private static readonly defaultAuthType = AuthType.Bearer;

  /**
   * A mapping of authentication types to their respective guards.
   */
  private readonly authTypeGuardMap = {} as Record<
    AuthType,
    CanActivate | CanActivate[]
  >;

  /**
   * Creates an instance of AuthenticationGuard.
   * @param reflector - Used to retrieve metadata attached to routes.
   * @param accessTokenGuard - Guard used to validate bearer token authentication.
   */
  constructor(
    private readonly reflector: Reflector,
    private readonly accessTokenGuard: AccessTokenGuard,
  ) {
    this.authTypeGuardMap = {
      [AuthType.Bearer]: this.accessTokenGuard,
      [AuthType.None]: { canActivate: () => true },
    };
  }

  /**
   * Determines whether the current request is authorized.
   * @param context - The execution context containing details about the current request.
   * @returns A promise resolving to `true` if the request is authorized; otherwise, throws an exception.
   * @throws {UnauthorizedException} When no guard allows access to the current request.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Retrieve authentication types defined for the route or use the default.
    const authTypes = this.reflector.getAllAndOverride<AuthType[]>(
      AUTH_TYPE_KEY,
      [context.getHandler(), context.getClass()],
    ) ?? [AuthenticationGuard.defaultAuthType];

    // Map authentication types to their respective guards and flatten the array.
    const guards = authTypes.map((type) => this.authTypeGuardMap[type]).flat();
    let error = new UnauthorizedException();

    // Check each guard to see if it authorizes the request.
    for (const instance of guards) {
      const canActivate = await Promise.resolve(
        instance.canActivate(context),
        // eslint-disable-next-line @typescript-eslint/no-loop-func
      ).catch((err) => {
        error = err;
      });

      if (canActivate) {
        return true;
      }
    }

    // Throw an error if no guard authorizes the request.
    throw error;
  }
}
