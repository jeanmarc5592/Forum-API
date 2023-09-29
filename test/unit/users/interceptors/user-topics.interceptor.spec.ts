import { CallHandler, ExecutionContext } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';

import { UserTopicsInterceptor } from '@users/interceptors/user-topics.interceptor';
import { UsersUtils } from '@users/users.utils';

import { mockUser } from '../fixtures/users.fixtures';

describe('UserTopicsInterceptor', () => {
  let interceptor: UserTopicsInterceptor;
  let usersUtils: UsersUtils;

  beforeEach(async () => {
    usersUtils = {
      getTopics: jest.fn(),
      getComments: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserTopicsInterceptor,
        {
          provide: UsersUtils,
          useValue: usersUtils,
        },
      ],
    }).compile();

    interceptor = module.get<UserTopicsInterceptor>(UserTopicsInterceptor);
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  it('should return the topics of a given user', (done) => {
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({}),
      }),
    } as ExecutionContext;

    jest.spyOn(usersUtils, 'getTopics').mockReturnValue(mockUser.topics);

    const mockCallHandler = {
      handle: () => of(mockUser),
    } as CallHandler<any>;

    const result = interceptor.intercept(context, mockCallHandler);

    result.subscribe((topics) => {
      expect(topics).toEqual(mockUser.topics);
      done();
    });
  });
});
