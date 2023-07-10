import {
  AbilityBuilder,
  ExtractSubjectType,
  createMongoAbility,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { Roles } from 'src/auth/auth.types';
import { Subjects, Actions, BuilderType } from './ability.types';

@Injectable()
export class AbilityFactory {
  defineAbility(user: User) {
    const builder = new AbilityBuilder(createMongoAbility);

    if (user.role === Roles.ADMIN) {
      this.defineAdminAbilities(builder);
    }

    if (user.role === Roles.MODERATOR) {
      this.defineModeratorAbilities(builder);
    }

    if (user.role === Roles.USER) {
      this.defineUserAbilities(builder);
    }

    return builder.build({
      detectSubjectType(subject) {
        return subject.constructor as ExtractSubjectType<Subjects>;
      },
    });
  }

  private ALLOWED_USER_UPDATE_FIELDS = [
    'age',
    'bio',
    'email',
    'password',
    'name',
  ];

  private defineAdminAbilities(builder: BuilderType) {
    const { can } = builder;

    can(Actions.MANAGE, 'all');
  }

  private defineModeratorAbilities(builder: BuilderType) {
    const { can } = builder;

    can(Actions.DELETE, User);
    can(Actions.UPDATE, User);
    can(Actions.READ, User);
  }

  private defineUserAbilities(builder: BuilderType) {
    const { can } = builder;

    can(Actions.DELETE, User);
    can(Actions.UPDATE, User);
    can(Actions.READ, User);
  }
}
