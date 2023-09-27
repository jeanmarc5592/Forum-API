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
});
