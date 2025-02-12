import { Entity, Property } from '@mikro-orm/core';
import { Field, ObjectType } from '@nestjs/graphql';

import { UserRepository } from '@/modules/user/user.repository';

import { BaseEntity } from '../../common/base.entity';

@Entity({ repository: () => UserRepository })
@ObjectType()
export class User extends BaseEntity {
  @Property()
  @Field(() => String)
  firstName: string;

  @Property()
  @Field(() => String)
  lastName: string;

  @Property({ unique: true })
  @Field(() => String)
  email: string;

  @Property({ hidden: true })
  password: string;
}
