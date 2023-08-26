import { Test, TestingModule } from '@nestjs/testing';

import { Roles } from '@auth/auth.types';
import { Topic } from '@topics/entities/topic.entity';
import { User } from '@users/entities/user.entity';
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

describe('UsersUtils', () => {
  let usersUtils: UsersUtils;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersUtils],
    }).compile();

    usersUtils = module.get<UsersUtils>(UsersUtils);
  });

  it('should be defined', () => {
    expect(usersUtils).toBeDefined();
  });

  it('should extract the sub categories of the given main category', () => {
    const result = usersUtils.getTopics(mockUser);

    expect(result).toEqual(mockUser.topics);
  });
});
