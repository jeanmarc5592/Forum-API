import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, CallHandler } from '@nestjs/common';
import { TopicCollectionInterceptor } from './topic-collection.interceptor';
import { of } from 'rxjs';
import { TopicsUtils } from '../topics.utils';
import { User } from '../../users/entities/user.entity';
import { SubCategory } from '../../categories/sub-categories/entities/sub-category.entity';
import { Topic } from '../entities/topic.entity';

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
};

describe('TopicCollectionInterceptor', () => {
  let interceptor: TopicCollectionInterceptor;
  let topicsUtils: TopicsUtils;

  beforeEach(async () => {
    topicsUtils = {
      transformTopic: jest.fn(),
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

  it('should transform topics in the response', (done) => {
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({}),
      }),
    } as ExecutionContext;

    jest.spyOn(topicsUtils, 'transformTopic').mockReturnValue(transformedTopic);

    const mockCallHandler = {
      handle: () => of([mockTopic]),
    } as CallHandler<any>;

    const result = interceptor.intercept(context, mockCallHandler);

    result.subscribe((result) => {
      expect(result[0]).toHaveProperty('id');
      expect(result[0]).toHaveProperty('title');
      expect(result[0]).toHaveProperty('content');
      expect(result[0]).toHaveProperty('userId');
      expect(result[0]).toHaveProperty('subCategoryId');
      expect(result[0]).toHaveProperty('closed');
      expect(result[0]).toHaveProperty('created_at');
      expect(result[0]).toHaveProperty('updated_at');
      expect(result[0].id).toBe(transformedTopic.id);
      expect(result[0].title).toBe(transformedTopic.title);
      expect(result[0].content).toBe(transformedTopic.content);
      expect(result[0].userId).toBe(transformedTopic.userId);
      expect(result[0].subCategoryId).toBe(transformedTopic.subCategoryId);
      expect(result[0].closed).toBe(transformedTopic.closed);
      done();
    });
  });
});
