import { Test, TestingModule } from '@nestjs/testing';

import { CommentsUtils } from '@/comments/comments.utils';
import { TopicsUtils } from '@topics/topics.utils';

import { mockTopic, mockTransformedTopic } from './fixtures/topics.fixtures';
import {
  mockComment,
  mockTransformedComment,
} from '../comments/fixtures/comments.fixtures';
import { MockCommentsUtils } from '../comments/fixtures/comments.utils.fixtures';

describe('TopicsUtils', () => {
  let topicsUtils: TopicsUtils;
  let commentsUtils: CommentsUtils;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TopicsUtils, MockCommentsUtils],
    }).compile();

    topicsUtils = module.get<TopicsUtils>(TopicsUtils);
    commentsUtils = module.get<CommentsUtils>(CommentsUtils);
  });

  it('should be defined', () => {
    expect(topicsUtils).toBeDefined();
  });

  it('should transform the provided topic correctly', () => {
    const result = topicsUtils.transform(mockTopic);

    expect(result).toHaveProperty('id');
    expect(result).toHaveProperty('title');
    expect(result).toHaveProperty('content');
    expect(result).toHaveProperty('userId');
    expect(result).toHaveProperty('subCategoryId');
    expect(result).toHaveProperty('closed');
    expect(result).toHaveProperty('created_at');
    expect(result).toHaveProperty('updated_at');
    expect(result.id).toBe(mockTransformedTopic.id);
    expect(result.title).toBe(mockTransformedTopic.title);
    expect(result.content).toBe(mockTransformedTopic.content);
    expect(result.userId).toBe(mockTransformedTopic.userId);
    expect(result.subCategoryId).toBe(mockTransformedTopic.subCategoryId);
    expect(result.closed).toBe(mockTransformedTopic.closed);
  });

  it('should extract the comments out of the topic correctly', () => {
    mockTopic.comments = [mockComment];

    jest
      .spyOn(commentsUtils, 'transform')
      .mockReturnValue(mockTransformedComment);

    const result = topicsUtils.getComments(mockTopic);

    expect(result).toBeInstanceOf(Array);

    result.forEach((comment) => {
      expect(comment).toHaveProperty('id');
      expect(comment).toHaveProperty('content');
      expect(comment).toHaveProperty('user.id');
      expect(comment).toHaveProperty('user.name');
      expect(comment).toHaveProperty('created_at');
      expect(comment).toHaveProperty('updated_at');

      expect(comment.id).toBe(mockComment.id);
      expect(comment.content).toBe(mockComment.content);
      expect(comment.user.id).toBe(mockComment.user.id);
      expect(comment.user.name).toBe(mockComment.user.name);
      expect(comment.created_at).toBe(mockComment.created_at);
      expect(comment.updated_at).toBe(mockComment.updated_at);
    });
  });
});
