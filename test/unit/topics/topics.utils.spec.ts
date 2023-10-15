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

  it('should transform the comments of the topic correctly', () => {
    const result = topicsUtils.transformComments(mockTopic.comments);

    expect(result).toBeInstanceOf(Array);

    result.forEach((comment) => {
      expect(comment).toHaveProperty('id');
      expect(comment).toHaveProperty('content');
      expect(comment).toHaveProperty('topic.id');
      expect(comment).toHaveProperty('topic.title');
      expect(comment).toHaveProperty('created_at');
      expect(comment).toHaveProperty('updated_at');

      expect(comment.id).toBe(mockTopic.comments[0].id);
      expect(comment.content).toBe(mockTopic.comments[0].content);
      expect(comment.topic?.id).toBe(mockTopic.comments[0].topic.id);
      expect(comment.topic?.title).toBe(mockTopic.comments[0].topic.title);
      expect(comment.created_at).toBe(mockTopic.comments[0].created_at);
      expect(comment.updated_at).toBe(mockTopic.comments[0].updated_at);
    });
  });
});
