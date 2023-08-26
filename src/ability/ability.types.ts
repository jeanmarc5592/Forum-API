import {
  AbilityBuilder,
  AbilityTuple,
  InferSubjects,
  MongoAbility,
  MongoQuery,
} from '@casl/ability';

import { MainCategory } from '@categories/main-categories/entities/main-category.entity';
import { SubCategory } from '@categories/sub-categories/entities/sub-category.entity';
import { Topic } from '@topics/entities/topic.entity';
import { User } from '@users/entities/user.entity';

export enum Actions {
  MANAGE = 'manage',
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
}

export type Subjects =
  | InferSubjects<
      typeof User | typeof MainCategory | typeof SubCategory | typeof Topic
    >
  | 'all';

export type AppAbility = MongoAbility<[Actions, Subjects]>;

export type BuilderType = AbilityBuilder<
  MongoAbility<AbilityTuple, MongoQuery>
>;
