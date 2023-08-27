import { Provider } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';

import { repositoryMockFactory } from '@/app.types';
import { Topic } from '@topics/entities/topic.entity';
import { TopicsService } from '@topics/topics.service';
import { TransformedTopic } from '@topics/topics.types';

export const MockTopicsService: Provider = {
  provide: TopicsService,
  useValue: {
    getAll: jest.fn(),
    getById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    create: jest.fn(),
  },
};

export const MockTopicsRepository: Provider = {
  provide: getRepositoryToken(Topic),
  useFactory: repositoryMockFactory,
};

export const mockTopics = [
  { id: '1', title: 'Topic 1' },
  { id: '2', title: 'Topic 2' },
  { id: '3', title: 'Topic 3' },
] as Topic[];

export const mockTopic = {
  id: '1',
  title: 'Topic',
  content: 'Topic Content',
  closed: false,
  subCategory: {
    id: 'sub-cat-1',
    name: 'Sub Cat 1',
  },
  user: {
    id: 'user-1',
    name: 'User 1',
  },
} as Topic;

export const mockTransformedTopic = {
  id: mockTopic.id,
  title: mockTopic.title,
  content: mockTopic.content,
  userId: mockTopic.user.id,
  subCategoryId: mockTopic.subCategory.id,
  closed: mockTopic.closed,
  created_at: mockTopic.created_at,
  updated_at: mockTopic.updated_at,
} as TransformedTopic;
