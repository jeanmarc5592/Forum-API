import {
  AbilityBuilder,
  AbilityTuple,
  InferSubjects,
  MongoAbility,
  MongoQuery,
} from '@casl/ability';
import { User } from '../users/entities/user.entity';
import { MainCategory } from 'src/categories/main-categories/entities/main-category.entity';
import { SubCategory } from 'src/categories/sub-categories/entities/sub-category.entity';
import { Topic } from 'src/topics/entities/topic.entity';

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
