import type {
  AnyEntity,
  DeepPartial,
  FilterQuery,
  Loaded,
} from '@mikro-orm/core';
import { wrap } from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/postgresql';
import { type EntityManager } from '@mikro-orm/postgresql';

export abstract class AbstractService<
  T extends object,
> extends EntityRepository<T> {
  constructor(
    private readonly repository: EntityRepository<T> & { entityName: string },
    protected readonly em: EntityManager,
  ) {
    super(em, repository.entityName);
  }

  async findWithPagination(
    filters: Parameters<EntityRepository<T>['findAndCount']>[0],
    {
      ...options
    }: Parameters<EntityRepository<T>['findAndCount']>[1] & {
      page: number;
      limit: number;
      pageSize: number;
    },
  ) {
    const pageSize = options.limit || options.pageSize || 10;
    const offset = options.offset || (options.page - 1) * pageSize || 0;
    const [data, total] = await this.repository.findAndCount(filters, {
      ...options,
      limit: pageSize,
      offset,
    });

    return {
      data,
      pagination: {
        page: options.page,
        pageSize,
        total,
        pageCount: Math.ceil(total / pageSize),
      },
    };
  }

  async findOneById(
    id: string | number,
    options?: Parameters<EntityRepository<T>['findOne']>[1],
  ) {
    return this.repository.findOne({ id } as FilterQuery<T>, options);
  }

  async update(
    entity: Loaded<T, string, string, string> | null,
    data: DeepPartial<T>,
  ) {
    wrap(entity as object).assign(data as object);
    await this.em.flush();
    return entity;
  }

  async findOneByIdAndUpdate(id: string | number, data: DeepPartial<T>) {
    const entity = await this.findOneById(id);
    wrap(entity as object).assign(data as object);
    await this.em.flush();
    return entity;
  }

  async findOneAndUpdate(
    where: Parameters<EntityRepository<T>['findOne']>[0],
    data: DeepPartial<T>,
  ) {
    const entity = await this.findOne(where);
    wrap(entity as object).assign(data as object);
    await this.em.flush();
    return entity;
  }

  async delete(entity: Loaded<T, string, string, string> | null) {
    await this.em.removeAndFlush(entity as AnyEntity);
    return entity;
  }

  async findOneByIdAndDelete(id: string | number) {
    const entity = await this.findOneById(id);
    await this.em.removeAndFlush(entity as AnyEntity);
    return entity;
  }

  async findOneAndDelete(where: Parameters<EntityRepository<T>['findOne']>[0]) {
    const entity = await this.findOne(where);
    await this.em.removeAndFlush(entity as AnyEntity);
    return entity;
  }
}
