import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';

import { User } from '@/modules/user/user.entity';

export class UserSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    em.create(User, {
      email: 'thanhnm@zigvy.com',
      firstName: 'thanh',
      lastName: 'ngo',
      password: '123456',
    });
  }
}
