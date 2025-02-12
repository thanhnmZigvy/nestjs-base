import { AsyncLocalStorage } from 'async_hooks';
import type { NextFunction, Request, Response } from 'express';
import set from 'lodash/set';

import type { User } from '@/modules/user/user.entity';

import { REQUEST_USER_KEY } from '../modules/iam/iam.constants';

/**
 * Extends the Express Request type to include a user property.
 */
type MyRequest = Request & {
  user: any;
};

const asyncLocalStorage = new AsyncLocalStorage<MyRequest>();

/**
 * Middleware to initialize the AsyncLocalStorage with the current request.
 * This allows for storing and accessing request-specific data throughout the lifecycle of the request.
 *
 * @param {Request} req - The incoming request object.
 * @param {Response} _res - The outgoing response object (not used).
 * @param {NextFunction} next - The next middleware function in the stack.
 */
export const asyncLocalStorageMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  asyncLocalStorage.enterWith(req as MyRequest);
  next();
};

/**
 * Retrieves the current request context from AsyncLocalStorage.
 *
 * @returns {MyRequest} The current request object with the user property.
 */
const getRequestContext = () => {
  return asyncLocalStorage.getStore() as MyRequest;
};

/**
 * Sets the current authenticated user in the request context.
 *
 * @param {any} authUser  - The authenticated user object to be stored in the request context.
 */
export const setCurrentUser = (authUser: any) => {
  set(getRequestContext(), REQUEST_USER_KEY, authUser);
};

/**
 * Retrieves the current authenticated user from the request context.
 *
 * @returns {any} The authenticated user object stored in the request context, or undefined if not set.
 */
export const getCurrentUser = () => {
  return getRequestContext()[REQUEST_USER_KEY] as User;
};
