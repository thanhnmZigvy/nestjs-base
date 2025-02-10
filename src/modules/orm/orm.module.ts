import { MikroOrmModule } from '@mikro-orm/nestjs';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { Module } from '@nestjs/common';

import { User } from '@/entities/user.entity';

import { MyConfigService } from '../myConfigService/myConfig.service';

/**
 * OrmModule is a NestJS module that configures MikroORM for database access.
 * It imports MikroORM modules and provides the necessary configuration
 * for connecting to the database and managing entities.
 */
@Module({
  imports: [
    MikroOrmModule.forRootAsync({
      useFactory: (configService: MyConfigService) => {
        // Use the configuration service to get ORM configurations
        return configService.data.ormConfigs;
      },
      inject: [MyConfigService], // Inject MyConfigService to access configuration data
      driver: PostgreSqlDriver,
    }),
    MikroOrmModule.forFeature({
      entities: [User], // Register the User entity for use in the application
    }),
  ],
  exports: [MikroOrmModule], // Export MikroOrmModule for use in other modules
})
export class OrmModule {}
