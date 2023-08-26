import {
  AbilityBuilder,
  ExtractSubjectType,
  createMongoAbility,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';

import { RequestUser, Roles } from '@auth/auth.types';
import { MainCategory } from '@categories/main-categories/entities/main-category.entity';
import { SubCategory } from '@categories/sub-categories/entities/sub-category.entity';
import { Topic } from '@topics/entities/topic.entity';
import { User } from '@users/entities/user.entity';

import { Subjects, Actions, BuilderType } from './ability.types';

@Injectable()
export class AbilityFactory {
  defineAbility(user: RequestUser) {
    this.builder = new AbilityBuilder(createMongoAbility);

    if (user.role === Roles.ADMIN) {
      this.defineAdminAbilities();
    }

    if (user.role === Roles.MODERATOR) {
      this.defineModeratorAbilities(user);
    }

    if (user.role === Roles.USER) {
      this.defineUserAbilities(user);
    }

    return this.builder.build({
      detectSubjectType(subject) {
        return subject.constructor as ExtractSubjectType<Subjects>;
      },
    });
  }

  private builder: BuilderType;

  private ALLOWED_USER_UPDATE_FIELDS = [
    'age',
    'bio',
    'email',
    'password',
    'name',
  ];

  private ALLOWED_TOPIC_UPDATE_FIELDS = ['title', 'content'];

  private defineAdminAbilities() {
    const { can } = this.builder;

    can(Actions.MANAGE, 'all');
  }

  private defineModeratorAbilities(user: RequestUser) {
    const { can } = this.builder;

    // USER
    can(Actions.DELETE, User, { id: { $eq: user.id } });
    can(Actions.UPDATE, User, this.ALLOWED_USER_UPDATE_FIELDS, {
      id: { $eq: user.id },
    });
    can(Actions.READ, User);

    // MAIN CATEGORY
    can(Actions.READ, MainCategory);

    // SUB CATEGORY
    can(Actions.READ, SubCategory);

    // TOPIC
    // TODO: Allow to manage Topic if topic.subCategoryId is inside moderator's assigned subCategories list
    can(Actions.READ, Topic);
    can(Actions.CREATE, Topic);
    can(Actions.UPDATE, Topic, this.ALLOWED_TOPIC_UPDATE_FIELDS, {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      'user.id': user.id,
    });
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    can(Actions.DELETE, Topic, { 'user.id': user.id });
  }

  private defineUserAbilities(user: RequestUser) {
    const { can } = this.builder;

    // USER
    can(Actions.DELETE, User, { id: { $eq: user.id } });
    can(Actions.UPDATE, User, this.ALLOWED_USER_UPDATE_FIELDS, {
      id: { $eq: user.id },
    });
    can(Actions.READ, User);

    // MAIN CATEGORY
    can(Actions.READ, MainCategory);

    // SUB CATEGORY
    can(Actions.READ, SubCategory);

    // TOPIC
    can(Actions.READ, Topic);
    can(Actions.CREATE, Topic);
    can(Actions.UPDATE, Topic, this.ALLOWED_TOPIC_UPDATE_FIELDS, {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      'user.id': user.id,
    });
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    can(Actions.DELETE, Topic, { 'user.id': user.id });
  }
}
