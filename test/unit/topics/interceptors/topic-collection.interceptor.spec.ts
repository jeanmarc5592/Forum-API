import { ExecutionContext, CallHandler } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';

import { TopicCollectionInterceptor } from '@topics/interceptors/topic-collection.interceptor';
import { TopicsUtils } from '@topics/topics.utils';

import { mockTopic, mockTransformedTopic } from '../fixtures/topics.fixtures';

describe('TopicCollectionInterceptor', () => {
  let interceptor: TopicCollectionInterceptor;
  let topicsUtils: TopicsUtils;

  beforeEach(async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    topicsUtils = {
      transform: jest.fn(),
      transformComments: jest.fn(),
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

    jest.spyOn(topicsUtils, 'transform').mockReturnValue(mockTransformedTopic);

    const mockCallHandler = {
      handle: () => of([mockTopic]),
    } as CallHandler<any>;

    const result = interceptor.intercept(context, mockCallHandler);

    result.subscribe((topics) => {
      expect(topics[0]).toHaveProperty('id');
      expect(topics[0]).toHaveProperty('title');
      expect(topics[0]).toHaveProperty('content');
      expect(topics[0]).toHaveProperty('user.id');
      expect(topics[0]).toHaveProperty('user.name');
      expect(topics[0]).toHaveProperty('subCategoryId');
      expect(topics[0]).toHaveProperty('closed');
      expect(topics[0]).toHaveProperty('created_at');
      expect(topics[0]).toHaveProperty('updated_at');
      expect(topics[0].id).toBe(mockTransformedTopic.id);
      expect(topics[0].title).toBe(mockTransformedTopic.title);
      expect(topics[0].content).toBe(mockTransformedTopic.content);
      expect(topics[0].user.id).toBe(mockTransformedTopic.user.id);
      expect(topics[0].user.name).toBe(mockTransformedTopic.user.name);
      expect(topics[0].subCategoryId).toBe(mockTransformedTopic.subCategoryId);
      expect(topics[0].closed).toBe(mockTransformedTopic.closed);
      done();
    });
  });
});
