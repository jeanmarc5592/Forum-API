import { Test, TestingModule } from '@nestjs/testing';

import { CommentsUtils } from '@/comments/comments.utils';

import {
  mockComment,
  mockTransformedComment,
} from './fixtures/comments.fixtures';

describe('CommentsUtils', () => {
  let commentsUtils: CommentsUtils;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CommentsUtils],
    }).compile();

    commentsUtils = module.get<CommentsUtils>(CommentsUtils);
  });

  it('should be defined', () => {
    expect(commentsUtils).toBeDefined();
  });

  it('should transform the provided comment correctly', () => {
    const result = commentsUtils.transform(mockComment);

    expect(result).toHaveProperty('id');
    expect(result).toHaveProperty('content');
    expect(result).toHaveProperty('user.id');
    expect(result).toHaveProperty('user.name');
    expect(result).toHaveProperty('created_at');
    expect(result).toHaveProperty('updated_at');

    expect(result.id).toBe(mockTransformedComment.id);
    expect(result.content).toBe(mockTransformedComment.content);
    expect(result.user.id).toBe(mockTransformedComment.user.id);
    expect(result.user.name).toBe(mockTransformedComment.user.name);
    expect(result.created_at).toBe(mockTransformedComment.created_at);
    expect(result.updated_at).toBe(mockTransformedComment.updated_at);
  });
});
