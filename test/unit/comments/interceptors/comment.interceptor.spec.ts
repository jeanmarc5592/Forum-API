import { ExecutionContext, CallHandler } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';

import { CommentsUtils } from '@/comments/comments.utils';
import { CommentInterceptor } from '@/comments/interceptors/comment.interceptor';

import {
  mockComment,
  mockTransformedComment,
} from '../fixtures/comments.fixtures';

describe('CommentInterceptor', () => {
  let interceptor: CommentInterceptor;
  let commentsUtils: CommentsUtils;

  beforeEach(async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    commentsUtils = {
      transform: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentInterceptor,
        {
          provide: CommentsUtils,
          useValue: commentsUtils,
        },
      ],
    }).compile();

    interceptor = module.get<CommentInterceptor>(CommentInterceptor);
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  it('should transform the comment in the response', (done) => {
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({}),
      }),
    } as ExecutionContext;

    jest
      .spyOn(commentsUtils, 'transform')
      .mockReturnValue(mockTransformedComment);

    const mockCallHandler = {
      handle: () => of(mockComment),
    } as CallHandler<any>;

    const result = interceptor.intercept(context, mockCallHandler);

    result.subscribe((comment) => {
      expect(comment).toHaveProperty('id');
      expect(comment).toHaveProperty('content');
      expect(comment).toHaveProperty('user.id');
      expect(comment).toHaveProperty('user.name');
      expect(comment).toHaveProperty('created_at');
      expect(comment).toHaveProperty('updated_at');

      expect(comment.id).toBe(mockTransformedComment.id);
      expect(comment.content).toBe(mockTransformedComment.content);
      expect(comment.user.id).toBe(mockTransformedComment.user?.id);
      expect(comment.user.name).toBe(mockTransformedComment.user?.name);
      expect(comment.created_at).toBe(mockTransformedComment.created_at);
      expect(comment.updated_at).toBe(mockTransformedComment.updated_at);
      done();
    });
  });
});
