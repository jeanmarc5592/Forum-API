import {
  AbilityBuilder,
  ExtractSubjectType,
  createMongoAbility,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { RequestUser, Roles } from '../auth/auth.types';
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

  private defineAdminAbilities() {
    const { can } = this.builder;

    can(Actions.MANAGE, 'all');
  }

  private defineModeratorAbilities(user: RequestUser) {
    const { can } = this.builder;

    can(Actions.DELETE, User, { id: { $eq: user.id } });
    can(Actions.UPDATE, User, this.ALLOWED_USER_UPDATE_FIELDS, {
      id: { $eq: user.id },
    });
    can(Actions.READ, User);
  }

  private defineUserAbilities(user: RequestUser) {
    const { can } = this.builder;

    can(Actions.DELETE, User, { id: { $eq: user.id } });
    can(Actions.UPDATE, User, this.ALLOWED_USER_UPDATE_FIELDS, {
      id: { $eq: user.id },
    });
    can(Actions.READ, User);
  }
}
