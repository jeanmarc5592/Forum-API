import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, CallHandler } from '@nestjs/common';
import { TopicInterceptor } from './topic.interceptor';
import { of } from 'rxjs';

describe('TopicCollectionInterceptor', () => {
  let interceptor: TopicInterceptor;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TopicInterceptor],
    }).compile();

    interceptor = module.get<TopicInterceptor>(TopicInterceptor);
  });

  it('should transform the topic in the response', (done) => {
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({}),
      }),
    } as ExecutionContext;

    const mockTopic = {
      id: 1,
      title: 'Topic 1',
      content: 'Content 1',
      user: { id: 101 },
      subCategory: { id: 201 },
      closed: false,
      created_at: new Date(),
      updated_at: new Date(),
    };

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
      expect(result.id).toBe(mockTopic.id);
      expect(result.title).toBe(mockTopic.title);
      expect(result.content).toBe(mockTopic.content);
      expect(result.userId).toBe(mockTopic.user.id);
      expect(result.subCategoryId).toBe(mockTopic.subCategory.id);
      expect(result.closed).toBe(mockTopic.closed);
      done();
    });
  });
});
