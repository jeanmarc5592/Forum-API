import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { MockType } from 'test/test.types';
import { CreateTopicDTO } from '@topics/dtos/create-topic.dto';
import { UpdateTopicDTO } from '@topics/dtos/update-topic.dto';
import { Topic } from '@topics/entities/topic.entity';
import { TopicsService } from '@topics/topics.service';

import {
  mockTopics,
  mockTopic,
  MockTopicsRepository,
} from './fixtures/topics.fixtures';
import { MockSubCategoriesService } from '../categories/sub-categories/fixtures/sub-categories.fixtures';
import { mockComment } from '../comments/fixtures/comments.fixtures';
import { MockUsersService } from '../users/fixtures/users.fixtures';

describe('TopicsService', () => {
  let service: TopicsService;
  let repositoryMock: MockType<Repository<Topic>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TopicsService,
        MockTopicsRepository,
        MockUsersService,
        MockSubCategoriesService,
      ],
    }).compile();

    service = module.get<TopicsService>(TopicsService);
    repositoryMock = module.get(getRepositoryToken(Topic));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAll', () => {
    it('should return a list of topics', async () => {
      repositoryMock.createQueryBuilder?.mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(mockTopics),
      });

      const topics = await service.getAll(10, 1);

      expect(topics).toEqual(mockTopics);
    });

    it('should return an empty list', async () => {
      repositoryMock.createQueryBuilder?.mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([]),
      });

      const topics = await service.getAll(10, 1);

      expect(topics).toEqual([]);
    });
  });

  describe('getById', () => {
    it('should return a topic', async () => {
      repositoryMock.createQueryBuilder?.mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(mockTopic),
      });

      const topic = await service.getById(mockTopic.id);

      expect(topic).toEqual(mockTopic);
    });

    it('should throw a NotFoundException if topic was not found', async () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      repositoryMock.findOneBy?.mockReturnValue(null);

      await expect(service.getById('12334')).rejects.toThrow(NotFoundException);
    });
  });

  describe('getComments', () => {
    it('should return a topic with its comments', async () => {
      mockTopic.comments = [mockComment];

      repositoryMock.createQueryBuilder?.mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(mockTopic),
      });

      const topic = await service.getComments(mockTopic.id);

      expect(topic).toHaveProperty('comments');
      expect(topic.comments).toEqual([mockComment]);
    });

    it('should throw a NotFoundException if topic was not found', async () => {
      repositoryMock.createQueryBuilder?.mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null),
      });

      await expect(service.getComments('12334')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a topic', async () => {
      const updates: UpdateTopicDTO = {
        title: 'Another Topic',
      };

      repositoryMock.findOneBy?.mockReturnValue(mockTopic);
      repositoryMock.save?.mockReturnValue({ ...mockTopic, ...updates });

      const topic = await service.update(updates, mockTopic.id);

      expect(topic).toEqual(mockTopic);
    });

    it('should throw a NotFoundException if topic was not found', async () => {
      const updates: UpdateTopicDTO = {
        title: 'Another Topic',
      };

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      repositoryMock.findOneBy?.mockReturnValue(null);

      await expect(service.update(updates, '12334')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('delete', () => {
    it('should delete a topic', async () => {
      repositoryMock.findOneBy?.mockReturnValue(mockTopic);
      repositoryMock.delete?.mockReturnValue(mockTopic);

      const topic = await service.delete(mockTopic.id);

      expect(topic).toEqual(mockTopic);
    });

    it('should throw a NotFoundException if topic was not found', async () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      repositoryMock.findOneBy?.mockReturnValue(null);

      await expect(service.delete('12334')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a topic', async () => {
      const newTopic: CreateTopicDTO = {
        title: 'New Topic',
        content: 'Content of new topic',
        subCategoryId: 'Sub-Cat-1',
      };

      repositoryMock.create?.mockReturnValue(newTopic);
      repositoryMock.save?.mockReturnValue(newTopic);

      const topic = await service.create(newTopic, '1');

      expect(topic).toEqual(newTopic);
    });
  });
});
