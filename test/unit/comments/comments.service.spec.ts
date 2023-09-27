import { Test, TestingModule } from '@nestjs/testing';

import { CommentsService } from '@/comments/comments.service';

import { MockCommentsRespository } from './fixtures/comments.fixtures';
import { MockTopicsService } from '../topics/fixtures/topics.fixtures';
import { MockUsersService } from '../users/fixtures/users.fixtures';

describe('CommentsService', () => {
  let service: CommentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentsService,
        MockTopicsService,
        MockUsersService,
        MockCommentsRespository,
      ],
    }).compile();

    service = module.get<CommentsService>(CommentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
