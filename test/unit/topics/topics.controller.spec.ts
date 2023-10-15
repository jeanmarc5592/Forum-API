import { Test, TestingModule } from '@nestjs/testing';

import { AbilityService } from '@ability/ability.service';
import { Roles } from '@auth/auth.types';
import { CreateTopicDTO } from '@topics/dtos/create-topic.dto';
import { UpdateTopicDTO } from '@topics/dtos/update-topic.dto';
import { Topic } from '@topics/entities/topic.entity';
import { TopicsAbilityService } from '@topics/topics.ability.service';
import { TopicsController } from '@topics/topics.controller';
import { TopicsService } from '@topics/topics.service';
import { User } from '@users/entities/user.entity';

import {
  mockTopics,
  mockTopic,
  MockTopicsService,
  MockTopicsAbilityService,
} from './fixtures/topics.fixtures';
import { MockTopicsUtils } from './fixtures/topics.utils.fixtures';
import { MockAbilityService } from '../ability/fixtures/ability.fixtures';
import { mockRequestWithUser } from '../auth/fixtures/auth.fixtures';
import { MockHttpUtils } from '../utils/fixtures/http.utils.fixtures';

describe('TopicsController', () => {
  let controller: TopicsController;
  let topicsService: TopicsService;
  let abilityService: AbilityService;
  let topicsAbilityService: TopicsAbilityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TopicsController],
      providers: [
        MockTopicsService,
        MockAbilityService,
        MockTopicsUtils,
        MockTopicsAbilityService,
        MockHttpUtils,
      ],
    }).compile();

    controller = module.get<TopicsController>(TopicsController);
    topicsService = module.get<TopicsService>(TopicsService);
    abilityService = module.get<AbilityService>(AbilityService);
    topicsAbilityService =
      module.get<TopicsAbilityService>(TopicsAbilityService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAll', () => {
    it('should return a list of topics', async () => {
      jest.spyOn(topicsService, 'getAll').mockResolvedValue(mockTopics);

      const topics = await controller.getAll({ page: 1, limit: 10 });

      expect(topics).toEqual(mockTopics);
    });
  });

  describe('getById', () => {
    it('should return the topic with the provided id', async () => {
      jest.spyOn(topicsService, 'getById').mockResolvedValue(mockTopic);

      const topic = await controller.getById('1');

      expect(topic).toEqual(mockTopic);
    });
  });

  describe('getComments', () => {
    it('should return the comments of the topic', async () => {
      jest
        .spyOn(topicsService, 'getComments')
        .mockResolvedValue(mockTopic.comments);

      const comments = await controller.getComments('1', {
        limit: 10,
        page: 1,
      });

      expect(comments).toEqual(mockTopic.comments);
    });
  });

  describe('update', () => {
    it('should return the updated topic', async () => {
      const topicId = mockTopic.id;
      const topicTitle = 'Updated Topic';
      const updates: UpdateTopicDTO = { title: topicTitle };

      Object.assign(mockTopic, updates);
      jest.spyOn(topicsService, 'update').mockResolvedValue(mockTopic);

      const topic = await controller.update(
        topicId,
        updates,
        mockRequestWithUser,
      );

      expect(topic.id).toBe(topicId);
      expect(topic.title).toBe(topicTitle);
    });

    it('should have called "canUpdate" of AbilityService correctly', async () => {
      const topicId = mockTopic.id;
      const topicTitle = 'Updated Topic';
      const updates: UpdateTopicDTO = { title: topicTitle };

      mockTopic.user = mockRequestWithUser.user as User;

      jest.spyOn(topicsService, 'getById').mockResolvedValue(mockTopic);

      const canUpdate = jest.spyOn(abilityService, 'canUpdate');

      await controller.update(topicId, updates, mockRequestWithUser);

      expect(canUpdate).toHaveBeenCalledWith(
        mockRequestWithUser.user,
        updates,
        mockTopic,
      );
    });

    it('should have called "canManage" of TopicsAbilityService correctly', async () => {
      const topicId = mockTopic.id;
      const topicTitle = 'Updated Topic';
      const updates: UpdateTopicDTO = { title: topicTitle };

      mockTopic.user = {
        id: '1623625',
        name: 'User-XY',
        role: Roles.MODERATOR,
      } as User;

      jest.spyOn(topicsService, 'getById').mockResolvedValue(mockTopic);

      const canManage = jest.spyOn(topicsAbilityService, 'canManage');

      await controller.update(topicId, updates, mockRequestWithUser);

      expect(canManage).toHaveBeenCalledWith(
        mockRequestWithUser.user,
        mockTopic,
      );
    });
  });

  describe('delete', () => {
    it('should return the deleted topic', async () => {
      jest.spyOn(topicsService, 'delete').mockResolvedValue(mockTopic);

      const topic = await controller.delete(mockTopic.id, mockRequestWithUser);

      expect(topic).toEqual(mockTopic);
    });

    it('should have called "canDelete" of AbilityService correctly', async () => {
      const topicId = mockTopic.id;

      mockTopic.user = mockRequestWithUser.user as User;

      jest.spyOn(topicsService, 'getById').mockResolvedValue(mockTopic);

      const canDelete = jest.spyOn(abilityService, 'canDelete');

      await controller.delete(topicId, mockRequestWithUser);

      expect(canDelete).toHaveBeenCalledWith(
        mockRequestWithUser.user,
        mockTopic,
      );
    });

    it('should have called "canManage" of TopicsAbilityService correctly', async () => {
      const topicId = mockTopic.id;

      mockTopic.user = {
        id: '1623625',
        name: 'User-XY',
        role: Roles.MODERATOR,
      } as User;

      jest.spyOn(topicsService, 'getById').mockResolvedValue(mockTopic);

      const canManage = jest.spyOn(topicsAbilityService, 'canManage');

      await controller.delete(topicId, mockRequestWithUser);

      expect(canManage).toHaveBeenCalledWith(
        mockRequestWithUser.user,
        mockTopic,
      );
    });
  });

  describe('create', () => {
    it('should return the created topic', async () => {
      const topicBody: CreateTopicDTO = {
        title: 'New Topic',
        content: 'Content of new topic',
        subCategoryId: 'Sub-Cat-1',
      };

      const newTopic = {
        id: '123',
        title: topicBody.title,
        content: topicBody.content,
        subCategory: { id: topicBody.subCategoryId },
        closed: false,
      } as Topic;

      jest.spyOn(topicsService, 'create').mockResolvedValue(newTopic);

      const topic = await controller.create(topicBody, mockRequestWithUser);

      expect(topic).toEqual(newTopic);
    });
  });
});
