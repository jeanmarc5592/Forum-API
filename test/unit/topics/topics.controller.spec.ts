import { Test, TestingModule } from '@nestjs/testing';

import { AbilityService } from '@ability/ability.service';
import { Roles, RequestUser } from '@auth/auth.types';
import { CreateTopicDTO } from '@topics/dtos/create-topic.dto';
import { UpdateTopicDTO } from '@topics/dtos/update-topic.dto';
import { Topic } from '@topics/entities/topic.entity';
import { TopicsController } from '@topics/topics.controller';
import { TopicsService } from '@topics/topics.service';
import { TopicsUtils } from '@topics/topics.utils';

const mockTopics = [
  { id: '1', title: 'Topic 1' },
  { id: '2', title: 'Topic 2' },
  { id: '3', title: 'Topic 3' },
] as Topic[];

const mockTopic = {
  id: '1',
  title: 'Topic',
  content: 'Topic Content',
  closed: false,
} as Topic;

const mockRequest = {
  user: {
    id: '123',
    name: 'Request User',
    email: 'requser@email.com',
    role: Roles.USER,
  } as RequestUser,
};

describe('TopicsController', () => {
  let controller: TopicsController;
  let topicsService: TopicsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TopicsController],
      providers: [
        {
          provide: TopicsService,
          useValue: {
            getAll: jest.fn(),
            getById: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: AbilityService,
          useValue: {
            canUpdate: jest.fn(),
            canDelete: jest.fn(),
            canCreate: jest.fn(),
          },
        },
        {
          provide: TopicsUtils,
          useValue: {
            transformTopic: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TopicsController>(TopicsController);
    topicsService = module.get<TopicsService>(TopicsService);
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

  describe('update', () => {
    it('should return the updated topic', async () => {
      const topicId = mockTopic.id;
      const topicTitle = 'Updated Topic';
      const updates: UpdateTopicDTO = { title: topicTitle };

      Object.assign(mockTopic, updates);
      jest.spyOn(topicsService, 'update').mockResolvedValue(mockTopic);

      const topic = await controller.update(topicId, updates, mockRequest);

      expect(topic.id).toBe(topicId);
      expect(topic.title).toBe(topicTitle);
    });
  });

  describe('delete', () => {
    it('should return the deleted topic', async () => {
      jest.spyOn(topicsService, 'delete').mockResolvedValue(mockTopic);

      const topic = await controller.delete(mockTopic.id, mockRequest);

      expect(topic).toEqual(mockTopic);
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

      const topic = await controller.create(topicBody, mockRequest);

      expect(topic).toEqual(newTopic);
    });
  });
});
