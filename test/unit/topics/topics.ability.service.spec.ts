import { ForbiddenException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { User } from '@/users/entities/user.entity';
import { RequestUser, Roles } from '@auth/auth.types';
import { SubCategoriesService } from '@categories/sub-categories/sub-categories.service';
import { TopicsAbilityService } from '@topics/topics.ability.service';

import { mockTopic } from './fixtures/topics.fixtures';
import {
  MockSubCategoriesService,
  mockSubCat,
} from '../categories/sub-categories/fixtures/sub-categories.fixtures';

describe('TopicsAbilityService', () => {
  let service: TopicsAbilityService;
  let subCategoriesService: SubCategoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TopicsAbilityService, MockSubCategoriesService],
    }).compile();

    service = module.get<TopicsAbilityService>(TopicsAbilityService);
    subCategoriesService =
      module.get<SubCategoriesService>(SubCategoriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('canManage', () => {
    it('should throw ForbiddenException if user is a normal user', async () => {
      const user = { id: '1', role: Roles.USER } as RequestUser;
      const topicToManage = mockTopic;

      await expect(service.canManage(user, topicToManage)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should throw ForbiddenException if user is not a valid moderator', async () => {
      const user = { id: '128237823742', role: Roles.MODERATOR } as RequestUser;
      const topicToManage = mockTopic;

      jest
        .spyOn(subCategoriesService, 'getModerators')
        .mockResolvedValue(mockSubCat.moderators);

      await expect(service.canManage(user, topicToManage)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should not throw ForbiddenException if user is an admin', () => {
      const user = { id: '1', role: Roles.ADMIN } as RequestUser;
      const topicToManage = mockTopic;

      expect(() => service.canManage(user, topicToManage)).not.toThrow(
        ForbiddenException,
      );
    });

    it('should not throw ForbiddenException if user is allowed to manage', async () => {
      const user = { id: '1', role: Roles.MODERATOR } as RequestUser;
      const topicToManage = mockTopic;

      Object.assign(mockTopic, { subCategory: mockSubCat });

      jest
        .spyOn(subCategoriesService, 'getModerators')
        .mockResolvedValue([user as User]);

      expect(() => service.canManage(user, topicToManage)).not.toThrow(
        ForbiddenException,
      );
    });
  });
});
