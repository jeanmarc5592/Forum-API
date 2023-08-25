import { Test, TestingModule } from '@nestjs/testing';
import { CallHandler, ExecutionContext } from '@nestjs/common';
import { of } from 'rxjs';
import { Roles } from '@auth/auth.types';
import { Topic } from '@topics/entities/topic.entity';
import { User } from '@users/entities/user.entity';
import { UserTopicsInterceptor } from '@users/interceptors/user-topics.interceptor';
import { UsersUtils } from '@users/users.utils';

const mockUser: User = {
  id: '1',
  name: 'Test User',
  email: 'test@example.com',
  password: 'My Password',
  age: '18',
  bio: 'User bio',
  created_at: new Date(),
  updated_at: new Date(),
  refreshToken: 'Token',
  topics: [
    { id: '1', title: 'Topic 1' } as Topic,
    { id: '2', title: 'Topic 2' } as Topic,
  ],
  role: Roles.USER,
  generateId: jest.fn(),
};

describe('UserTopicsInterceptor', () => {
  let interceptor: UserTopicsInterceptor;
  let mainCatUtils: UsersUtils;

  beforeEach(async () => {
    mainCatUtils = {
      getTopics: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserTopicsInterceptor,
        {
          provide: UsersUtils,
          useValue: mainCatUtils,
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

    jest.spyOn(mainCatUtils, 'getTopics').mockReturnValue(mockUser.topics);

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
