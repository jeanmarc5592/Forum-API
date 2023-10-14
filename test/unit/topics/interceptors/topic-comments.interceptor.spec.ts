import { ExecutionContext, CallHandler } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';

import { Comment } from '@/comments/entities/comment.entity';
import { TopicCommentsInterceptor } from '@/topics/interceptors/topic-comments.interceptor';
import { TopicsUtils } from '@topics/topics.utils';

import { mockTopic } from '../fixtures/topics.fixtures';

describe('TopicCommentsInterceptor', () => {
  let interceptor: TopicCommentsInterceptor;
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
        TopicCommentsInterceptor,
        {
          provide: TopicsUtils,
          useValue: topicsUtils,
        },
      ],
    }).compile();

    interceptor = module.get<TopicCommentsInterceptor>(
      TopicCommentsInterceptor,
    );
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  it('should extract the comments from the given topic', (done) => {
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({}),
      }),
    } as ExecutionContext;

    jest
      .spyOn(topicsUtils, 'transformComments')
      .mockReturnValue(mockTopic.comments);

    const mockCallHandler = {
      handle: () => of(mockTopic.comments),
    } as CallHandler<any>;

    const result = interceptor.intercept(context, mockCallHandler);

    result.subscribe((comments: Comment[]) => {
      expect(comments).toBeInstanceOf(Array);

      comments.forEach((comment) => {
        expect(comment).toHaveProperty('id');
        expect(comment).toHaveProperty('content');
        expect(comment).toHaveProperty('topic.id');
        expect(comment).toHaveProperty('topic.title');
        expect(comment).toHaveProperty('user.id');
        expect(comment).toHaveProperty('user.name');

        expect(comment.id).toBe(mockTopic.comments[0].id);
        expect(comment.content).toBe(mockTopic.comments[0].content);
        expect(comment.topic.id).toBe(mockTopic.comments[0].topic.id);
        expect(comment.topic.title).toBe(mockTopic.comments[0].topic.title);
        expect(comment.user.id).toBe(mockTopic.comments[0].user.id);
        expect(comment.user.name).toBe(mockTopic.comments[0].user.name);
      });

      done();
    });
  });
});
