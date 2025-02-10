import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import type { Request, Response } from 'express';
import { GraphQLError, GraphQLFormattedError } from 'graphql';
import { join } from 'path';

import { AppService } from './app.service';
import { DatabaseModule } from './modules/database/database.module';
import { IamModule } from './modules/iam/iam.module';
import { MyConfigServiceModule } from './modules/myConfigService/myConfig.module';
import { MyConfigService } from './modules/myConfigService/myConfig.service';
import { OrmModule } from './modules/orm/orm.module';
import { LoggerMiddleware } from './morgan/Logger.middleware';

/**
 * The main application module for the NestJS application.
 * This module imports necessary modules and configures the GraphQL server.
 */
@Module({
  imports: [
    MyConfigServiceModule,
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useFactory: (configService: MyConfigService) => {
        return {
          // Automatically generate the GraphQL schema file
          autoSchemaFile: join(process.cwd(), './src/modules/schema.gql'),

          // Context function to provide request and response objects
          context: ({ req, res }: { req: Request; res: Response }) => ({
            req,
            res,
          }),

          // Enable or disable debug mode based on the configuration
          debug: configService.data.isDevelopment,

          // Disable the GraphQL playground
          playground: false,

          // Apollo Server plugins
          plugins: [ApolloServerPluginLandingPageLocalDefault()],

          // Custom error formatting for GraphQL errors
          formatError: (error: GraphQLError) => {
            const graphQLFormattedError: GraphQLFormattedError = {
              message:
                (error.extensions.originalError as Error)?.message ||
                (error.extensions.originalError as string) ||
                error.message,
            };
            return graphQLFormattedError;
          },
        };
      },

      // Inject the MyConfigService to access configuration settings
      inject: [MyConfigService],
    }),
    OrmModule,
    DatabaseModule,
    IamModule,
  ],

  // Providers for dependency injection
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes('/api/{*wildcard}');
  }
}
