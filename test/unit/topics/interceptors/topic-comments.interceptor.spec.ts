import { ExecutionContext, CallHandler } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';

import { Comment } from '@/comments/entities/comment.entity';
import { TopicCommentsInterceptor } from '@/topics/interceptors/topic-comments.interceptor';
import { TopicsUtils } from '@topics/topics.utils';

import { mockComment } from '../../comments/fixtures/comments.fixtures';
import { mockTopic } from '../fixtures/topics.fixtures';

describe('TopicCommentsInterceptor', () => {
  let interceptor: TopicCommentsInterceptor;
  let topicsUtils: TopicsUtils;

  beforeEach(async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    topicsUtils = {
      transform: jest.fn(),
      getComments: jest.fn(),
      commentsUtils: {
        transform: jest.fn(),
      },
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

    jest.spyOn(topicsUtils, 'getComments').mockReturnValue([mockComment]);

    mockTopic.comments = [mockComment];
    const mockCallHandler = {
      handle: () => of(mockTopic),
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

        expect(comment.id).toBe(mockComment.id);
        expect(comment.content).toBe(mockComment.content);
        expect(comment.topic.id).toBe(mockComment.topic.id);
        expect(comment.topic.title).toBe(mockComment.topic.title);
        expect(comment.user.id).toBe(mockComment.user.id);
        expect(comment.user.name).toBe(mockComment.user.name);
      });

      done();
    });
  });
});
