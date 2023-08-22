import { Test, TestingModule } from '@nestjs/testing';
import { Topic } from '../../../../src/topics/entities/topic.entity';
import { MainCategory } from '../../../../src/categories/main-categories/entities/main-category.entity';
import { SubCategory } from '../../../../src/categories/sub-categories/entities/sub-category.entity';
import { TransformedSubCategory } from '../../../../src/categories/sub-categories/sub-categories.types';
import { SubCategoriesUtils } from '../../../../src/categories/sub-categories/sub-categories.utils';

const mockSubCat: SubCategory = {
  id: '1',
  name: 'React',
  description: 'All About React',
  mainCategory: {
    id: '1',
    name: 'Frontend Development',
  } as MainCategory,
  topics: [
    { id: '1', title: 'Topic 1' } as Topic,
    { id: '2', title: 'Topic 2' } as Topic,
  ],
  created_at: new Date(),
  updated_at: new Date(),
  generateId: jest.fn(),
};

const transformedSubCat = {
  id: mockSubCat.id,
  name: mockSubCat.name,
  description: mockSubCat.description,
  mainCategoryId: mockSubCat.mainCategory.id,
  topics: mockSubCat.topics,
} as TransformedSubCategory;

describe('SubCategoriesUtils', () => {
  let subCatUtils: SubCategoriesUtils;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubCategoriesUtils],
    }).compile();

    subCatUtils = module.get<SubCategoriesUtils>(SubCategoriesUtils);
  });

  it('should be defined', () => {
    expect(subCatUtils).toBeDefined();
  });

  it('should transform the provided sub category correctly without topics', () => {
    const result = subCatUtils.transform(mockSubCat);

    expect(result).toHaveProperty('id');
    expect(result).toHaveProperty('name');
    expect(result).toHaveProperty('description');
    expect(result).toHaveProperty('mainCategoryId');
    expect(result.id).toBe(transformedSubCat.id);
    expect(result.name).toBe(transformedSubCat.name);
    expect(result.description).toBe(transformedSubCat.description);
    expect(result.mainCategoryId).toBe(transformedSubCat.mainCategoryId);

    expect(result).not.toHaveProperty('topics');
  });

  it('should transform the provided sub category correclty and include topics', () => {
    const result = subCatUtils.transformWithTopics(mockSubCat);

    expect(result).toHaveProperty('id');
    expect(result).toHaveProperty('name');
    expect(result).toHaveProperty('description');
    expect(result).toHaveProperty('mainCategoryId');
    expect(result).toHaveProperty('topics');
    expect(result.id).toBe(transformedSubCat.id);
    expect(result.name).toBe(transformedSubCat.name);
    expect(result.description).toBe(transformedSubCat.description);
    expect(result.mainCategoryId).toBe(transformedSubCat.mainCategoryId);
    expect(result.topics).toBe(transformedSubCat.topics);
  });
});
