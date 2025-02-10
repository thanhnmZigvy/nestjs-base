import { SetMetadata } from '@nestjs/common';

import type { AuthType } from '../enums/auth-type.enum';

export const AUTH_TYPE_KEY = 'authType';

/**
 * Auth decorator to set the authentication type metadata for a route handler.
 *
 * @param authTypes - One or more authentication types to be applied to the route.
 * @returns A decorator function that sets the authentication type metadata.
 */
export const Auth = (...authTypes: AuthType[]) =>
  SetMetadata(AUTH_TYPE_KEY, authTypes);
