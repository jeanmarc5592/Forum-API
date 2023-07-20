import { ForbiddenException, Injectable } from '@nestjs/common';
import { AbilityFactory } from './ability.factory';
import { RequestUser } from 'src/auth/auth.types';
import { Actions } from './ability.types';

@Injectable()
export class AbilityService {
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
}
