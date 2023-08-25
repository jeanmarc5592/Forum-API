import { Test, TestingModule } from '@nestjs/testing';
import { MainCategory } from '@categories/main-categories/entities/main-category.entity';
import { SubCategory } from '@categories/sub-categories/entities/sub-category.entity';
import { MainCategoriesUtils } from '@categories/main-categories/main-categories.utils';

const mockMainCat: MainCategory = {
  id: '1',
  name: 'Frontend Development',
  description: 'All About Frontend Development',
  subCategories: [
    {
      id: '1',
      name: 'React',
    } as SubCategory,
    {
      id: '2',
      name: 'Vue',
    } as SubCategory,
  ],
  created_at: new Date(),
  updated_at: new Date(),
  generateId: jest.fn(),
};

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
    const result = mainCatUtils.transformWithSubCategories(mockMainCat);

    expect(result).toEqual(mockMainCat.subCategories);
  });
});
