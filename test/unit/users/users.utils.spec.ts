import { Test, TestingModule } from '@nestjs/testing';

import { UsersUtils } from '@users/users.utils';

import { mockUser } from './fixtures/users.fixtures';
import { mockComment } from '../comments/fixtures/comments.fixtures';

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

  it('should extract the topics of the given user', () => {
    const result = usersUtils.getTopics(mockUser);

    expect(result).toEqual(mockUser.topics);
  });

  it('should extract the comments of given user', () => {
    mockUser.comments = [mockComment];

    const result = usersUtils.getComments(mockUser);

    expect(result).toEqual(mockUser.comments);
  });
});
