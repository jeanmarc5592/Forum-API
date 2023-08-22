import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, CallHandler } from '@nestjs/common';
import { TopicCollectionInterceptor } from '../../../../src/topics/interceptors/topic-collection.interceptor';
import { of } from 'rxjs';
import { TopicsUtils } from '../../../../src/topics/topics.utils';
import { User } from '../../../../src/users/entities/user.entity';
import { SubCategory } from '../../../../src/categories/sub-categories/entities/sub-category.entity';
import { Topic } from '../../../../src/topics/entities/topic.entity';
import { TransformedTopic } from '../../../../src/topics/topics.types';

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
  let interceptor: TopicCollectionInterceptor;
  let topicsUtils: TopicsUtils;

  beforeEach(async () => {
    topicsUtils = {
      transform: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TopicCollectionInterceptor,
        {
          provide: TopicsUtils,
          useValue: topicsUtils,
        },
      ],
    }).compile();

    interceptor = module.get<TopicCollectionInterceptor>(
      TopicCollectionInterceptor,
    );
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  it('should transform topics in the response', (done) => {
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({}),
      }),
    } as ExecutionContext;

    jest.spyOn(topicsUtils, 'transform').mockReturnValue(transformedTopic);

    const mockCallHandler = {
      handle: () => of([mockTopic]),
    } as CallHandler<any>;

    const result = interceptor.intercept(context, mockCallHandler);

    result.subscribe((topics) => {
      expect(topics[0]).toHaveProperty('id');
      expect(topics[0]).toHaveProperty('title');
      expect(topics[0]).toHaveProperty('content');
      expect(topics[0]).toHaveProperty('userId');
      expect(topics[0]).toHaveProperty('subCategoryId');
      expect(topics[0]).toHaveProperty('closed');
      expect(topics[0]).toHaveProperty('created_at');
      expect(topics[0]).toHaveProperty('updated_at');
      expect(topics[0].id).toBe(transformedTopic.id);
      expect(topics[0].title).toBe(transformedTopic.title);
      expect(topics[0].content).toBe(transformedTopic.content);
      expect(topics[0].userId).toBe(transformedTopic.userId);
      expect(topics[0].subCategoryId).toBe(transformedTopic.subCategoryId);
      expect(topics[0].closed).toBe(transformedTopic.closed);
      done();
    });
  });
});
