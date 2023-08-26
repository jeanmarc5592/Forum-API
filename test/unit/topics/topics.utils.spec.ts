import { Test, TestingModule } from '@nestjs/testing';

import { SubCategory } from '@categories/sub-categories/entities/sub-category.entity';
import { Topic } from '@topics/entities/topic.entity';
import { TransformedTopic } from '@topics/topics.types';
import { TopicsUtils } from '@topics/topics.utils';
import { User } from '@users/entities/user.entity';

const mockTopic = {
  id: '1',
  title: 'Topic 1',
  content: 'Content 1',
  user: { id: '101' } as User,
  subCategory: { id: '201' } as SubCategory,
  closed: false,
  created_at: new Date(),
  updated_at: new Date(),
} as Topic;

const transformedTopic = {
  id: mockTopic.id,
  title: mockTopic.title,
  content: mockTopic.content,
  userId: mockTopic.user.id,
  subCategoryId: mockTopic.subCategory.id,
  closed: mockTopic.closed,
  created_at: mockTopic.created_at,
  updated_at: mockTopic.updated_at,
} as TransformedTopic;

describe('TopicsUtils', () => {
  let topicsUtils: TopicsUtils;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TopicsUtils],
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
    expect(result.id).toBe(transformedTopic.id);
    expect(result.title).toBe(transformedTopic.title);
    expect(result.content).toBe(transformedTopic.content);
    expect(result.userId).toBe(transformedTopic.userId);
    expect(result.subCategoryId).toBe(transformedTopic.subCategoryId);
    expect(result.closed).toBe(transformedTopic.closed);
  });
});
