import { MikroOrmModule } from '@mikro-orm/nestjs';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { Module } from '@nestjs/common';

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
  ],
})
export class OrmModule {}
