import { ExecutionContext, CallHandler } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';

import { Comment } from '@/comments/entities/comment.entity';
import { UserCommentsInterceptor } from '@/users/interceptors/user-comments.interceptor';
import { UsersUtils } from '@/users/users.utils';

import { mockUser } from '../fixtures/users.fixtures';

describe('TopicCommentsInterceptor', () => {
  let interceptor: UserCommentsInterceptor;
  let usersUtils: UsersUtils;

  beforeEach(async () => {
    usersUtils = {
      getTopics: jest.fn(),
      transformComments: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserCommentsInterceptor,
        {
          provide: UsersUtils,
          useValue: usersUtils,
        },
      ],
    }).compile();

    interceptor = module.get<UserCommentsInterceptor>(UserCommentsInterceptor);
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  it('should extract the comments from the given user', (done) => {
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({}),
      }),
    } as ExecutionContext;

    jest
      .spyOn(usersUtils, 'transformComments')
      .mockReturnValue(mockUser.comments);

    const mockCallHandler = {
      handle: () => of(mockUser.comments),
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

        expect(comment.id).toBe(mockUser.comments[0].id);
        expect(comment.content).toBe(mockUser.comments[0].content);
        expect(comment.topic.id).toBe(mockUser.comments[0].topic.id);
        expect(comment.topic.title).toBe(mockUser.comments[0].topic.title);
        expect(comment.user.id).toBe(mockUser.comments[0].user.id);
        expect(comment.user.name).toBe(mockUser.comments[0].user.name);
      });

      done();
    });
  });
});
