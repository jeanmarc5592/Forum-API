import { ForbiddenException, Injectable } from '@nestjs/common';

import { AbilityServiceInterface } from '@/ability/ability.types';
import { RequestUser, Roles } from '@auth/auth.types';
import { SubCategoriesService } from '@categories/sub-categories/sub-categories.service';

import { Topic } from './entities/topic.entity';

@Injectable()
export class TopicsAbilityService implements AbilityServiceInterface {
  constructor(private readonly subCategoriesService: SubCategoriesService) {}

  async canManage(reqUser: RequestUser, topicToManage: Topic) {
    if (reqUser.role === Roles.ADMIN) {
      return;
    }

    if (reqUser.role !== Roles.MODERATOR) {
      throw new ForbiddenException(
        `User must have '${Roles.MODERATOR}' role to manage other users' topics or comments within this sub category.`,
      );
    }

    const moderators = await this.subCategoriesService.getModerators(
      topicToManage.subCategory.id,
    );
    const isValidModerator = !!moderators.find((mod) => mod.id === reqUser.id);

    if (!isValidModerator) {
      throw new ForbiddenException(
        'Only moderators of this sub category can manage this topic.',
      );
    }

    return;
  }
}
