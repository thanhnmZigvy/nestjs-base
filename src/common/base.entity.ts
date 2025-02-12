import { Opt, PrimaryKey, Property } from '@mikro-orm/core';
import { Field, ObjectType } from '@nestjs/graphql';
import { v4 as uuidv4 } from 'uuid';

/**
 * BaseEntity is an abstract class that serves as a base for all entities in the application.
 * It provides common properties such as `id`, `createdAt`, and `updatedAt` for all derived entities.
 */
@ObjectType()
export abstract class BaseEntity {
  /**
   * Unique identifier for the entity, generated using UUID v4.
   */
  @PrimaryKey()
  @Field(() => String)
  id = uuidv4();

  /**
   * The date and time when the entity was created.
   * Automatically set to the current date and time upon creation.
   */
  @Property()
  @Field(() => Date)
  createdAt: Date & Opt = new Date();

  /**
   * The date and time when the entity was last updated.
   * Automatically updated to the current date and time whenever the entity is updated.
   */
  @Property({ onUpdate: () => new Date() })
  @Field(() => Date)
  updatedAt: Date & Opt = new Date();
}
