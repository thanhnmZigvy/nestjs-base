import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import configuration from 'src/config/configuration';

import { MyConfigService } from './myConfig.service';

/**
 * MyConfigServiceModule is a global module that provides configuration
 * services for the application. It loads environment variables and
 * configuration settings using the ConfigModule from NestJS.
 */
@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration], // Load the configuration from the specified source
      cache: true, // Cache the configuration for performance
      // Load environment variables from the appropriate .env file based on the current environment
      envFilePath: join(process.cwd(), `/.env/.env.${process.env.NODE_ENV}`),
    }),
  ],
  providers: [MyConfigService], // Provide the MyConfigService for dependency injection
  exports: [MyConfigService], // Export MyConfigService so it can be used in other modules
})
export class MyConfigServiceModule {}
