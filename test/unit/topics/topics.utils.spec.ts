import { Test, TestingModule } from '@nestjs/testing';

import { TopicsUtils } from '@topics/topics.utils';

import { mockTopic, mockTransformedTopic } from './fixtures/topics.fixtures';
import { MockCommentsUtils } from '../comments/fixtures/comments.utils.fixtures';

describe('TopicsUtils', () => {
  let topicsUtils: TopicsUtils;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TopicsUtils, MockCommentsUtils],
    }).compile();

    topicsUtils = module.get<TopicsUtils>(TopicsUtils);
  });

  it('should be defined', () => {
    expect(topicsUtils).toBeDefined();
  });

  it('should transform the provided topic correctly', () => {
    const result = topicsUtils.transform(mockTopic);

    expect(result).toHaveProperty('id');
    expect(result).toHaveProperty('title');
    expect(result).toHaveProperty('content');
    expect(result).toHaveProperty('user.id');
    expect(result).toHaveProperty('user.name');
    expect(result).toHaveProperty('subCategoryId');
    expect(result).toHaveProperty('closed');
    expect(result).toHaveProperty('created_at');
    expect(result).toHaveProperty('updated_at');
    expect(result.id).toBe(mockTransformedTopic.id);
    expect(result.title).toBe(mockTransformedTopic.title);
    expect(result.content).toBe(mockTransformedTopic.content);
    expect(result.user.id).toBe(mockTransformedTopic.user.id);
    expect(result.user.name).toBe(mockTransformedTopic.user.name);
    expect(result.subCategoryId).toBe(mockTransformedTopic.subCategoryId);
    expect(result.closed).toBe(mockTransformedTopic.closed);
  });

  it('should transform the comments of the topic correctly', () => {
    const result = topicsUtils.transformComments(mockTopic.comments);

    expect(result).toBeInstanceOf(Array);

    result.forEach((comment) => {
      expect(comment).toHaveProperty('id');
      expect(comment).toHaveProperty('content');
      expect(comment).toHaveProperty('user.id');
      expect(comment).toHaveProperty('user.name');
      expect(comment).toHaveProperty('created_at');
      expect(comment).toHaveProperty('updated_at');

      expect(comment.id).toBe(mockTopic.comments[0].id);
      expect(comment.content).toBe(mockTopic.comments[0].content);
      expect(comment.user?.id).toBe(mockTopic.comments[0].user.id);
      expect(comment.user?.name).toBe(mockTopic.comments[0].user.name);
      expect(comment.created_at).toBe(mockTopic.comments[0].created_at);
      expect(comment.updated_at).toBe(mockTopic.comments[0].updated_at);
    });
  });
});
