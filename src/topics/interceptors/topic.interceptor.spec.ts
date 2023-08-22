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

describe('TopicInterceptor', () => {
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

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
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

    const result = interceptor.intercept(context, mockCallHandler);

    result.subscribe((topic) => {
      expect(topic).toHaveProperty('id');
      expect(topic).toHaveProperty('title');
      expect(topic).toHaveProperty('content');
      expect(topic).toHaveProperty('userId');
      expect(topic).toHaveProperty('subCategoryId');
      expect(topic).toHaveProperty('closed');
      expect(topic).toHaveProperty('created_at');
      expect(topic).toHaveProperty('updated_at');
      expect(topic.id).toBe(transformedTopic.id);
      expect(topic.title).toBe(transformedTopic.title);
      expect(topic.content).toBe(transformedTopic.content);
      expect(topic.userId).toBe(transformedTopic.userId);
      expect(topic.subCategoryId).toBe(transformedTopic.subCategoryId);
      expect(topic.closed).toBe(transformedTopic.closed);
      done();
    });
  });
});
