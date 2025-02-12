import { MikroORM } from '@mikro-orm/core';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const generator = await app.get(MikroORM);
  try {
    const migrator = generator.getMigrator();
    // Run pending migrations
    const result = await migrator.up();
    console.log('run migrations...');
    // If migrations were applied, seed the database with initial data
    if (result.length) {
      const seedManager = generator.getSeeder();
      await seedManager.seedString('DatabaseSeeder'); // Seed the database using the 'DatabaseSeeder'
      console.log('Seeding data successfully');
    } else {
      console.log('No migrations to run');
    }
  } catch (error) {
    // Log any errors that occur during migration or seeding
    console.log('🚀 ~ bootstrap ~ error:', error);
  }
  await app.close();
}
bootstrap();
