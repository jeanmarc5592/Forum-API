import { Test, TestingModule } from '@nestjs/testing';

import { MainCategoriesUtils } from '@categories/main-categories/main-categories.utils';

import { mockMainCat } from './fixtures/main-categories.fixtures';

describe('SubCategoriesUtils', () => {
  let mainCatUtils: MainCategoriesUtils;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MainCategoriesUtils],
    }).compile();

    mainCatUtils = module.get<MainCategoriesUtils>(MainCategoriesUtils);
  });

  it('should be defined', () => {
    expect(mainCatUtils).toBeDefined();
  });

  it('should extract the sub categories of the given main category', () => {
    const result = mainCatUtils.getSubCategories(mockMainCat);

    expect(result).toEqual(mockMainCat.subCategories);
  });
});
