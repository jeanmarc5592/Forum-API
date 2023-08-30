import { ForbiddenException, Injectable } from '@nestjs/common';

import { RequestUser } from '@auth/auth.types';

import { AbilityFactory } from './ability.factory';
import { AbilityServiceInterface, Actions } from './ability.types';

@Injectable()
export class AbilityService implements AbilityServiceInterface {
  constructor(private readonly abilityFactory: AbilityFactory) {}

  canUpdate(reqUser: RequestUser, reqBody: object, subjectToEdit: any) {
    const ability = this.abilityFactory.defineAbility(reqUser);
    const requirements: boolean[] = [];
    const fieldsToUpdate = Object.keys(reqBody);

    fieldsToUpdate.forEach((field) => {
      requirements.push(ability.can(Actions.UPDATE, subjectToEdit, field));
    });

    const isAllowed = requirements.every(Boolean);

    if (!isAllowed) {
      throw new ForbiddenException();
    }

    return;
  }

  canDelete(reqUser: RequestUser, subjectToDelete: any) {
    const ability = this.abilityFactory.defineAbility(reqUser);
    const isAllowed = ability.can(Actions.DELETE, subjectToDelete);

    if (!isAllowed) {
      throw new ForbiddenException();
    }

    return;
  }

  canCreate(reqUser: RequestUser, subjectToCreate: any) {
    const ability = this.abilityFactory.defineAbility(reqUser);
    const isAllowed = ability.can(Actions.CREATE, subjectToCreate);

    if (!isAllowed) {
      throw new ForbiddenException();
    }

    return;
  }
}
