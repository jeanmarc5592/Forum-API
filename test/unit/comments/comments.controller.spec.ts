import { Test, TestingModule } from '@nestjs/testing';

import { CommentsController } from '@/comments/comments.controller';

import { MockCommentsService } from './fixtures/comments.fixtures';
import { MockCommentsUtils } from './fixtures/comments.utils.fixtures';
import { MockAbilityService } from '../ability/fixtures/ability.fixtures';
import {
  MockTopicsAbilityService,
  MockTopicsService,
} from '../topics/fixtures/topics.fixtures';
import { MockHttpUtils } from '../utils/fixtures/http.utils.fixtures';

describe('CommentsController', () => {
  let controller: CommentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentsController],
      providers: [
        MockCommentsService,
        MockCommentsUtils,
        MockHttpUtils,
        MockAbilityService,
        MockTopicsService,
        MockTopicsAbilityService,
      ],
    }).compile();

    controller = module.get<CommentsController>(CommentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
