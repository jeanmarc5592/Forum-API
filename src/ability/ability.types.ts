/* eslint-disable prettier/prettier */
import {
  AbilityBuilder,
  AbilityTuple,
  InferSubjects,
  MongoAbility,
  MongoQuery,
} from '@casl/ability';

import { RequestUser } from '@/auth/auth.types';
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
      typeof User | typeof MainCategory | typeof SubCategory | typeof Topic | typeof Comment
    >
  | 'all';

export type AppAbility = MongoAbility<[Actions, Subjects]>;

export type BuilderType = AbilityBuilder<
  MongoAbility<AbilityTuple, MongoQuery>
>;

export interface AbilityServiceInterface {
  canRead?: (reqUser: RequestUser, subjectToRead: any) => void;
  canUpdate?: (reqUser: RequestUser, reqBody: object, subjectToUpdate: any) => void;
  canDelete?: (reqUser: RequestUser, subjectToDelete: any) => void;
  canCreate?: (reqUser: RequestUser, subjectToCreate: any) => void;
  canManage?: (reqUser: RequestUser, subjectToManage: any) => void;
}
