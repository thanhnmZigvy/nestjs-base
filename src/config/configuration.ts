import { Migrator } from '@mikro-orm/migrations';
import type { MikroOrmModuleSyncOptions } from '@mikro-orm/nestjs';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { SeedManager } from '@mikro-orm/seeder';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';
import { Logger } from '@nestjs/common';
import { registerAs } from '@nestjs/config';
import { resolve } from 'path';

// const UserSubscriber = ...; // Uncomment and import your event subscriber if needed
// import path from 'path'; // Uncomment if you need to resolve paths for entities

const logger = new Logger('MikroORM');

/**
 * Configuration for the application, including database and JWT settings.
 * This configuration is registered with NestJS's ConfigModule.
 */
const configuration = registerAs('app', () => {
  const config = {
    port: Number(process.env.PORT), // Application port
    beUrl: process.env.BE_URL || 'http://localhost:3000', // Backend URL
    database: {
      host: process.env.DB_HOST, // Database host
      port: Number(process.env.DB_PORT), // Database port
    },
    ormConfigs: {
      driver: PostgreSqlDriver, // ORM driver for PostgreSQL
      // entities: [User ], // Uncomment to specify entities
      entities: [resolve(__dirname, '../**/*.entity{.ts,.js}')],
      entitiesTs: [resolve(__dirname, '../**/*.entity{.ts,.js}')],
      // subscribers: [User Subscriber], // Uncomment to add event subscribers
      host: process.env.DB_HOST, // Database host
      user: process.env.DB_USERNAME, // Database username
      password: process.env.DB_PASSWORD, // Database password
      dbName: process.env.DB_DATABASE, // Database name
      port: Number(process.env.DB_PORT), // Database port
      // autoLoadEntities: true, // Automatically load entities
      highlighter: new SqlHighlighter(), // SQL highlighter for logging
      // debug: true, // Uncomment to enable debug logging
      logger: logger.log.bind(logger), // Logger for MikroORM
      extensions: [Migrator, SeedManager],
      migrations: {
        path: resolve(__dirname, '../migrations'),
        pathTs: resolve(__dirname, '../migrations'),
      },
      seeder: {
        path: resolve(__dirname, '../seeders'),
        pathTs: resolve(__dirname, '../seeders'),
      },
    } as MikroOrmModuleSyncOptions,
    isDevelopment: process.env.NODE_ENV === 'development', // Check if the environment is development

    jwt: {
      secret: process.env.JWT_SECRET, // JWT secret for signing tokens
      accessTokenTtl: parseInt(process.env.JWT_ACCESS_TOKEN_TTL ?? '3600', 10), // Access token TTL
      refreshTokenTtl: parseInt(
        process.env.JWT_REFRESH_TOKEN_TTL ?? '86400',
        10,
      ), // Refresh token TTL
    },
  } as const;
  return config; // Return the configuration object
});

export default configuration; // Export the configuration for use in the application
