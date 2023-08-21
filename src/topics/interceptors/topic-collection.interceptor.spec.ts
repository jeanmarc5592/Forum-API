import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, CallHandler } from '@nestjs/common';
import { TopicCollectionInterceptor } from './topic-collection.interceptor';
import { of } from 'rxjs';

describe('TopicCollectionInterceptor', () => {
  let interceptor: TopicCollectionInterceptor;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TopicCollectionInterceptor],
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

    const mockTopics = [
      {
        id: 1,
        title: 'Topic 1',
        content: 'Content 1',
        user: { id: 101 },
        subCategory: { id: 201 },
        closed: false,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];

    const mockCallHandler = {
      handle: () => of(mockTopics),
    } as CallHandler<any>;

    const transformedTopics = interceptor.intercept(context, mockCallHandler);

    transformedTopics.subscribe((result) => {
      expect(result[0]).toHaveProperty('id');
      expect(result[0]).toHaveProperty('title');
      expect(result[0]).toHaveProperty('content');
      expect(result[0]).toHaveProperty('userId');
      expect(result[0]).toHaveProperty('subCategoryId');
      expect(result[0]).toHaveProperty('closed');
      expect(result[0]).toHaveProperty('created_at');
      expect(result[0]).toHaveProperty('updated_at');
      expect(result[0].id).toBe(mockTopics[0].id);
      expect(result[0].title).toBe(mockTopics[0].title);
      expect(result[0].content).toBe(mockTopics[0].content);
      expect(result[0].userId).toBe(mockTopics[0].user.id);
      expect(result[0].subCategoryId).toBe(mockTopics[0].subCategory.id);
      expect(result[0].closed).toBe(mockTopics[0].closed);
      done();
    });
  });
});
