import { EntityRepository } from '@mikro-orm/postgresql'; // Import EntityManager from your driver package or `@mikro-orm/knex`

import { User } from '@/modules/user/user.entity';

/**
 * UserRepository is a custom repository for managing User entities.
 * It extends the EntityRepository class from MikroORM, allowing for
 * custom methods to be added for user-specific database operations.
 */
export class UserRepository extends EntityRepository<User> {
  entityName = User.name; // Set the entity name for the repository
}
