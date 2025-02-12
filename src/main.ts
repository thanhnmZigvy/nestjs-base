import { MikroORM } from '@mikro-orm/core';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';

import { AppModule } from './app.module';
import { MyConfigService } from './modules/myConfigService/myConfig.service';
import { asyncLocalStorageMiddleware } from './utils/request-context';

/**
 * The bootstrap function initializes the NestJS application.
 * It sets up middleware, configures CORS, and manages the database schema.
 *
 * @async
 * @function bootstrap
 * @returns {Promise<void>} A promise that resolves when the application is fully initialized and listening.
 */
async function bootstrap() {
  // Create a new NestJS application instance using the root module (AppModule)
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // In Express v5, query parameters are no longer parsed using the qs library by default.
  // Instead, the simple parser is used, which does not support nested objects or arrays.
  // Revert to the previous behavior by setting the query parser to 'extended'
  app.set('query parser', 'extended');

  // Enable CORS (Cross-Origin Resource Sharing) for specified origins and allow credentials
  app.enableCors({
    origin: ['http://localhost:3000', 'http://192.168.0.156:3000'], // Allow requests from this origin
    credentials: true, // Allow credentials (e.g., cookies) to be sent with requests
  });

  // Use cookie-parser middleware to parse cookies from incoming requests
  app.use(cookieParser());

  // Use custom middleware for managing request context (e.g., storing request-specific data)
  app.use(asyncLocalStorageMiddleware);

  // Retrieve configuration settings from the custom configuration service
  const { port, isDevelopment } = MyConfigService.config;

  // Get the MikroORM instance for database operations
  const generator = await app.get(MikroORM);

  // If in development mode, ensure the database exists and update the schema
  if (isDevelopment) {
    // Ensure the database exists (create it if it doesn't)
    await generator.getSchemaGenerator().ensureDatabase();
    // Update the database schema to match the entity definitions
    await generator.getSchemaGenerator().updateSchema();
  } else {
    // In non-development environments, run migrations and seed data if necessary
    try {
      const migrator = generator.getMigrator();
      // Run pending migrations
      const result = await migrator.up();
      // If migrations were applied, seed the database with initial data
      if (result.length) {
        const seedManager = generator.getSeeder();
        await seedManager.seedString('DatabaseSeeder'); // Seed the database using the 'DatabaseSeeder'
      }
    } catch (error) {
      // Log any errors that occur during migration or seeding
      console.log('🚀 ~ bootstrap ~ error:', error);
    }
  }

  // Start the application and listen on the specified port
  await app.listen(port);

  // Construct the base URL of the running application
  const url = `${await app.getUrl()}`;

  // ANSI escape codes for adding colors to console output
  const reset = '\x1b[0m'; // Reset color
  const green = '\x1b[32m'; // Green color
  const cyan = '\x1b[36m'; // Cyan color

  // Log the server URL and available endpoints to the console
  console.info(
    `${green}Server running on:${reset}\n` +
      `  ${cyan}GraphQL: ${reset}${url}/graphql\n` + // GraphQL endpoint
      `  ${cyan}Resi API: ${reset}${url}/api`, // REST API endpoint
  );
}

// Call the bootstrap function to start the application
bootstrap();
