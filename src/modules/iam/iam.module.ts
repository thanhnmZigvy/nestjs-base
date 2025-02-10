import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';

import { UserSubscriber } from '@/eventSubscriber/user.subscriber';

import { MyConfigService } from '../myConfigService/myConfig.service';
import { OrmModule } from '../orm/orm.module';
import { AuthenticationResolver } from './authentication/authentication.resolver';
import { AuthenticationService } from './authentication/authentication.service';
import { AccessTokenGuard } from './guards/access-token/access-token.guard';
import { AuthenticationGuard } from './guards/authentication/authentication.guard';
import { BcryptService } from './hashing/bcrypt.service';
import { HashingService } from './hashing/hashing.service';

/**
 * IamModule is a NestJS module that encapsulates the authentication and authorization
 * functionality of the application. It provides services, guards, and resolvers
 * necessary for managing user authentication and access control.
 */
@Module({
  imports: [
    OrmModule, // Import the ORM module for database interactions
    JwtModule.registerAsync({
      useFactory: (configService: MyConfigService) => {
        const { jwt } = configService.data; // Retrieve JWT configuration from the config service
        return {
          secret: jwt.secret, // Set the JWT secret
        };
      },
      inject: [MyConfigService], // Inject the MyConfigService to access configuration
    }),
  ],
  providers: [
    {
      provide: HashingService, // Provide the HashingService
      useClass: BcryptService, // Use BcryptService as the implementation for HashingService
    },
    {
      provide: APP_GUARD, // Register the AuthenticationGuard as a global guard
      useClass: AuthenticationGuard,
    },
    AccessTokenGuard, // Provide the AccessTokenGuard for route protection
    AuthenticationGuard, // Provide the AuthenticationGuard for route protection
    AuthenticationService, // Provide the AuthenticationService for handling authentication logic
    UserSubscriber, // Provide the UserSubscriber for event handling related to users
    AuthenticationResolver, // Provide the AuthenticationResolver for GraphQL authentication operations
  ],
})
export class IamModule {}
