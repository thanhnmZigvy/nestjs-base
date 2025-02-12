import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';

import { AbstractService } from '@/common/abstract.service';
import type { User } from '@/modules/user/user.entity';

import { UserRepository } from './user.repository';

@Injectable()
export class UserService extends AbstractService<User> {
  constructor(
    private readonly userRepository: UserRepository,
    protected readonly em: EntityManager,
  ) {
    super(userRepository, em);
  }
}
