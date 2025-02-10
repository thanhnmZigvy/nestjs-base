import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import configuration from 'src/config/configuration';

/**
 * MyConfigService is a service that provides access to application configuration.
 * It uses NestJS's configuration module to inject and manage configuration data.
 */
@Injectable()
export class MyConfigService {
  // Static property to hold the configuration data for access outside the class
  static config: ConfigType<typeof configuration>;

  /**
   * Creates an instance of MyConfigService.
   *
   * @param data - The configuration data injected from the configuration module.
   */
  constructor(
    @Inject(configuration.KEY)
    public readonly data: ConfigType<typeof configuration>,
  ) {
    MyConfigService.config = this.data; // Assign the injected data to the static config property
  }
}
