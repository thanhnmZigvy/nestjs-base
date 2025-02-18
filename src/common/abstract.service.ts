import type {
  AnyEntity,
  DeepPartial,
  FilterQuery,
  Loaded,
} from '@mikro-orm/core';
import { wrap } from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/postgresql';
import { type EntityManager } from '@mikro-orm/postgresql';

/**
 * AbstractService class provides a base service with common CRUD operations.
 *
 * @template T - The type of the entity.
 * @extends EntityRepository<T>
 */
export abstract class AbstractService<
  T extends object,
> extends EntityRepository<T> {
  /**
   * Constructs an instance of AbstractService.
   *
   * @param repository - The entity repository with an entity name.
   * @param em - The entity manager.
   */
  constructor(
    private readonly repository: EntityRepository<T> & { entityName: string },
    protected readonly em: EntityManager,
  ) {
    super(em, repository.entityName);
  }

  /**
   * Finds entities with pagination.
   *
   * @param filters - The filters to apply.
   * @param options - The pagination and other options.
   * @returns An object containing the data and pagination information.
   */
  async findWithPagination(
    filters: Parameters<EntityRepository<T>['findAndCount']>[0],
    {
      ...options
    }: Parameters<EntityRepository<T>['findAndCount']>[1] & {
      page?: number;
      limit?: number;
      pageSize?: number;
      skip?: number;
      take?: number;
    },
  ) {
    const pageSize = options.limit || options.take || options.pageSize || 10;
    const offset =
      options.offset ||
      options.skip ||
      (options.page ? (options.page - 1) * pageSize : 0);
    const [data, total] = await this.repository.findAndCount(filters, {
      ...options,
      limit: pageSize,
      offset,
    });

    return {
      data,
      pagination: {
        page: options.page || Math.floor(offset / pageSize) + 1,
        pageSize,
        total,
        pageCount: Math.ceil(total / pageSize),
      },
    };
  }

  /**
   * Finds an entity by its ID.
   *
   * @param id - The ID of the entity.
   * @param options - Additional options for the query.
   * @returns The found entity or null if not found.
   */
  async findOneById(
    id: string | number,
    options?: Parameters<EntityRepository<T>['findOne']>[1],
  ) {
    return this.repository.findOne({ id } as FilterQuery<T>, options);
  }

  /**
   * Updates an entity with the given data.
   *
   * @param entity - The entity to update.
   * @param data - The data to update the entity with.
   * @returns The updated entity.
   */
  async update(
    entity: Loaded<T, string, string, string> | null,
    data: DeepPartial<T>,
  ) {
    wrap(entity as object).assign(data as object);
    await this.em.flush();
    return entity;
  }

  /**
   * Finds an entity by its ID and updates it with the given data.
   *
   * @param id - The ID of the entity.
   * @param data - The data to update the entity with.
   * @returns The updated entity.
   */
  async findOneByIdAndUpdate(id: string | number, data: DeepPartial<T>) {
    const entity = await this.findOneById(id);
    wrap(entity as object).assign(data as object);
    await this.em.flush();
    return entity;
  }

  /**
   * Finds an entity by the given criteria and updates it with the given data.
   *
   * @param where - The criteria to find the entity.
   * @param data - The data to update the entity with.
   * @returns The updated entity.
   */
  async findOneAndUpdate(
    where: Parameters<EntityRepository<T>['findOne']>[0],
    data: DeepPartial<T>,
  ) {
    const entity = await this.findOne(where);
    wrap(entity as object).assign(data as object);
    await this.em.flush();
    return entity;
  }

  /**
   * Deletes the given entity.
   *
   * @param entity - The entity to delete.
   * @returns The deleted entity.
   */
  async delete(entity: Loaded<T, string, string, string> | null) {
    await this.em.removeAndFlush(entity as AnyEntity);
    return entity;
  }

  /**
   * Finds an entity by its ID and deletes it.
   *
   * @param id - The ID of the entity.
   * @returns The deleted entity.
   */
  async findOneByIdAndDelete(id: string | number) {
    const entity = await this.findOneById(id);
    await this.em.removeAndFlush(entity as AnyEntity);
    return entity;
  }

  /**
   * Finds an entity by the given criteria and deletes it.
   *
   * @param where - The criteria to find the entity.
   * @returns The deleted entity.
   */
  async findOneAndDelete(where: Parameters<EntityRepository<T>['findOne']>[0]) {
    const entity = await this.findOne(where);
    await this.em.removeAndFlush(entity as AnyEntity);
    return entity;
  }
}
