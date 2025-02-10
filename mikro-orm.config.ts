import { defineConfig } from '@mikro-orm/core';
import { Migrator } from '@mikro-orm/migrations'; // or `@mikro-orm/migrations-mongodb`
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { SeedManager } from '@mikro-orm/seeder';
import dotenv from 'dotenv';
import { join, resolve } from 'path';

dotenv.config({
  path: join(
    process.cwd(),
    `/.env/.env.${process.env.NODE_ENV || 'development'}`,
  ),
});
export default defineConfig({
  driver: PostgreSqlDriver, // ORM driver for PostgreSQL

  host: process.env.DB_HOST, // Database host
  user: process.env.DB_USERNAME, // Database username
  password: process.env.DB_PASSWORD, // Database password
  dbName: process.env.DB_DATABASE, // Database name
  port: Number(process.env.DB_PORT), // Database port
  entities: [resolve(__dirname, './src/**/*.entity{.ts,.js}')],
  entitiesTs: [resolve(__dirname, './src/**/*.entity{.ts,.js}')],

  extensions: [Migrator, SeedManager],
});
// export default defineConfig({
//   driver: PostgreSqlDriver, // ORM driver for PostgreSQL

//   host: process.env.DB_HOST, // Database host
//   user: process.env.DB_USERNAME, // Database username
//   password: process.env.DB_PASSWORD, // Database password
//   dbName: process.env.DB_DATABASE, // Database name
//   port: Number(process.env.DB_PORT), // Database port
//   entities: [resolve(__dirname, './src/**/*.entity{.ts,.js}')],
//   entitiesTs: [resolve(__dirname, './src/**/*.entity{.ts,.js}')],

//   extensions: [Migrator, SeedManager],
// });
