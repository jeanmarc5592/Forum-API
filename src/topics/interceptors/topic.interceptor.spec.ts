import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, CallHandler } from '@nestjs/common';
import { TopicInterceptor } from './topic.interceptor';
import { of } from 'rxjs';
import { TopicsUtils } from '../topics.utils';
import { SubCategory } from '../../categories/sub-categories/entities/sub-category.entity';
import { User } from '../../users/entities/user.entity';
import { Topic } from '../entities/topic.entity';
import { TransformedTopic } from '../topics.types';

const mockTopic = {
  id: '1',
  title: 'Topic 1',
  content: 'Content 1',
  user: { id: '101' } as User,
  subCategory: { id: '201' } as SubCategory,
  closed: false,
  created_at: new Date(),
  updated_at: new Date(),
} as Topic;

const transformedTopic = {
  id: mockTopic.id,
  title: mockTopic.title,
  content: mockTopic.content,
  userId: mockTopic.user.id,
  subCategoryId: mockTopic.subCategory.id,
  closed: mockTopic.closed,
  created_at: mockTopic.created_at,
  updated_at: mockTopic.updated_at,
} as TransformedTopic;

describe('TopicCollectionInterceptor', () => {
  let interceptor: TopicInterceptor;
  let topicsUtils: TopicsUtils;

  beforeEach(async () => {
    topicsUtils = {
      transform: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TopicInterceptor,
        {
          provide: TopicsUtils,
          useValue: topicsUtils,
        },
      ],
    }).compile();

    interceptor = module.get<TopicInterceptor>(TopicInterceptor);
  });

  it('should transform the topic in the response', (done) => {
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({}),
      }),
    } as ExecutionContext;

    jest.spyOn(topicsUtils, 'transform').mockReturnValue(transformedTopic);

    const mockCallHandler = {
      handle: () => of(mockTopic),
    } as CallHandler<any>;

    const transformedTopics = interceptor.intercept(context, mockCallHandler);

    transformedTopics.subscribe((result) => {
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('title');
      expect(result).toHaveProperty('content');
      expect(result).toHaveProperty('userId');
      expect(result).toHaveProperty('subCategoryId');
      expect(result).toHaveProperty('closed');
      expect(result).toHaveProperty('created_at');
      expect(result).toHaveProperty('updated_at');
      expect(result.id).toBe(transformedTopic.id);
      expect(result.title).toBe(transformedTopic.title);
      expect(result.content).toBe(transformedTopic.content);
      expect(result.userId).toBe(transformedTopic.userId);
      expect(result.subCategoryId).toBe(transformedTopic.subCategoryId);
      expect(result.closed).toBe(transformedTopic.closed);
      done();
    });
  });
});
