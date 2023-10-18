import { ExecutionContext, CallHandler } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';

import { TopicInterceptor } from '@topics/interceptors/topic.interceptor';
import { TopicsUtils } from '@topics/topics.utils';

import { mockTopic, mockTransformedTopic } from '../fixtures/topics.fixtures';

describe('TopicInterceptor', () => {
  let interceptor: TopicInterceptor;
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

    jest.spyOn(topicsUtils, 'transform').mockReturnValue(mockTransformedTopic);

    const mockCallHandler = {
      handle: () => of(mockTopic),
    } as CallHandler<any>;

    const result = interceptor.intercept(context, mockCallHandler);

    result.subscribe((topic) => {
      expect(topic).toHaveProperty('id');
      expect(topic).toHaveProperty('title');
      expect(topic).toHaveProperty('content');
      expect(topic).toHaveProperty('user.id');
      expect(topic).toHaveProperty('user.name');
      expect(topic).toHaveProperty('subCategoryId');
      expect(topic).toHaveProperty('closed');
      expect(topic).toHaveProperty('created_at');
      expect(topic).toHaveProperty('updated_at');
      expect(topic.id).toBe(mockTransformedTopic.id);
      expect(topic.title).toBe(mockTransformedTopic.title);
      expect(topic.content).toBe(mockTransformedTopic.content);
      expect(topic.user.id).toBe(mockTransformedTopic.user.id);
      expect(topic.user.name).toBe(mockTransformedTopic.user.name);
      expect(topic.subCategoryId).toBe(mockTransformedTopic.subCategoryId);
      expect(topic.closed).toBe(mockTransformedTopic.closed);
      done();
    });
  });
});
