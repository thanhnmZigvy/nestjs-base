import { MikroORM } from '@mikro-orm/core';
import { AbstractSqlConnection } from '@mikro-orm/postgresql';
import { Global, Module } from '@nestjs/common';
import { Kysely } from 'kysely';
import { KyselyKnexDialect, PGColdDialect } from 'kysely-knex';

import { Database } from './database';

/**
 * DatabaseModule is a global module that provides a Kysely database instance
 * configured to work with MikroORM and PostgreSQL. It exports the Database
 * service for use in other modules.
 */
@Global()
@Module({
  exports: [Database], // Export the Database service for use in other modules
  providers: [
    {
      provide: Database, // Provide the Database service
      useFactory: (orm: MikroORM) => {
        // Create a Kysely instance using the MikroORM connection
        const conn = orm.em
          .getDriver()
          .getConnection() as AbstractSqlConnection; // Get the SQL connection from MikroORM
        const knex = conn.getKnex(); // Get the Knex instance from the connection
        return new Kysely<Database>({
          dialect: new KyselyKnexDialect({
            knex, // Pass the Knex instance to Kysely
            kyselySubDialect: new PGColdDialect(), // Use the PostgreSQL dialect for Kysely
          }),
          // Uncomment the log function to enable query logging
          // log(event) {
          //   if (event.level === 'query') {
          //     console.log(event.query.sql);
          //     console.log(event.query.parameters);
          //   }
          // },
        });
      },
      inject: [MikroORM], // Inject MikroORM into the factory function
    },
  ],
})
export class DatabaseModule {}
