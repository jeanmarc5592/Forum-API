import { ForbiddenException, Injectable } from '@nestjs/common';

import { AbilityServiceInterface } from '@/ability/ability.types';
import { RequestUser, Roles } from '@auth/auth.types';
import { SubCategoriesService } from '@categories/sub-categories/sub-categories.service';

import { Topic } from './entities/topic.entity';

@Injectable()
export class TopicsAbilityService implements AbilityServiceInterface {
  constructor(private readonly subCategoriesService: SubCategoriesService) {}

  async canManage(reqUser: RequestUser, subjectToManage: Topic) {
    if (reqUser.role === Roles.ADMIN) {
      return;
    }

    if (reqUser.role !== Roles.MODERATOR) {
      throw new ForbiddenException(
        `User must have '${Roles.MODERATOR}' to manage other users' topics within this sub category.`,
      );
    }

    const subCategory = await this.subCategoriesService.getModerators(
      subjectToManage.subCategory.id,
    );
    const isValidModerator = !!subCategory.moderators.find(
      (mod) => mod.id === reqUser.id,
    );

    if (!isValidModerator) {
      throw new ForbiddenException(
        'Only moderators of this sub category can manage this topic.',
      );
    }

    return;
  }
}
