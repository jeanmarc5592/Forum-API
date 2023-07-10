import {
  AbilityBuilder,
  AbilityTuple,
  InferSubjects,
  MongoAbility,
  MongoQuery,
} from '@casl/ability';
import { User } from '../users/entities/user.entity';

export enum Actions {
  MANAGE = 'manage',
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
}

export type Subjects = InferSubjects<typeof User> | 'all';

export type AppAbility = MongoAbility<[Actions, Subjects]>;

export type BuilderType = AbilityBuilder<
  MongoAbility<AbilityTuple, MongoQuery>
>;

export interface RequiredRule {
  action: Actions;
  subject: Subjects;
}
