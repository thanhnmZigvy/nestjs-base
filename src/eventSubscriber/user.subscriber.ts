import { EntityName, EventArgs, EventSubscriber } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';

import { User } from '@/entities/user.entity';

import { HashingService } from '../modules/iam/hashing/hashing.service';

/**
 * Subscriber class for the User entity that listens to lifecycle events.
 * This class is responsible for handling events related to User entity creation and updates.
 */
@Injectable()
export class UserSubscriber implements EventSubscriber<User> {
  constructor(
    private em: EntityManager,
    private readonly hashingService: HashingService,
  ) {
    // Register the subscriber with the event manager
    this.em.getEventManager().registerSubscriber(this);
  }

  /**
   * Returns the list of entities that this subscriber is interested in.
   *
   * @returns {Array<EntityName<User>>} An array containing the User entity.
   */
  getSubscribedEntities(): EntityName<User>[] {
    return [User];
  }

  /**
   * Event handler that is called before a User entity is created.
   * This method hashes the password of the User entity if it is provided.
   *
   * @param {EventArgs<User>} args - The event arguments containing the User entity and its change set.
   * @returns {Promise<void>} A promise that resolves when the password has been hashed.
   */
  async beforeCreate(args: EventArgs<User>): Promise<void> {
    if (args?.changeSet?.payload?.password && args.entity.password) {
      args.entity.password = await this.hashingService.hash(
        args.entity.password,
      );
    }
  }

  /**
   * Event handler that is called before a User entity is updated.
   * This method hashes the password of the User entity if it is provided.
   *
   * @param {EventArgs<User>} args - The event arguments containing the User entity and its change set.
   * @returns {Promise<void>} A promise that resolves when the password has been hashed.
   */
  async beforeUpdate(args: EventArgs<User>): Promise<void> {
    if (args?.changeSet?.payload?.password && args.entity.password) {
      args.entity.password = await this.hashingService.hash(
        args.entity.password,
      );
    }
  }
}
