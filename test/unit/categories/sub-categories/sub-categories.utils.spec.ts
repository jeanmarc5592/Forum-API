import { Test, TestingModule } from '@nestjs/testing';

import { TransformedSubCategory } from '@categories/sub-categories/sub-categories.types';
import { SubCategoriesUtils } from '@categories/sub-categories/sub-categories.utils';

import { mockSubCat } from './fixtures/sub-categories.fixtures';

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

  it('should extract the topics of the provided sub category', () => {
    const result = subCatUtils.getTopics(mockSubCat);

    expect(result).toEqual(mockSubCat.topics);
  });
});
