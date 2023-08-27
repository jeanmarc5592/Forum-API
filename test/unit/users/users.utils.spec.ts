import { Test, TestingModule } from '@nestjs/testing';

import { UsersUtils } from '@users/users.utils';

import { mockUser } from './fixtures/users.fixtures';

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
