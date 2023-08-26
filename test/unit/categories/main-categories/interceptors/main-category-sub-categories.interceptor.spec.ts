import { CallHandler, ExecutionContext } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';

import { MainCategory } from '@categories/main-categories/entities/main-category.entity';
import { MainCategorySubCategoriesInterceptor } from '@categories/main-categories/interceptors/main-category-sub-categories.interceptor';
import { MainCategoriesUtils } from '@categories/main-categories/main-categories.utils';
import { SubCategory } from '@categories/sub-categories/entities/sub-category.entity';

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

describe('MainCategorySubCategoriesInterceptor', () => {
  let interceptor: MainCategorySubCategoriesInterceptor;
  let mainCatUtils: MainCategoriesUtils;

  beforeEach(async () => {
    mainCatUtils = {
      getSubCategories: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MainCategorySubCategoriesInterceptor,
        {
          provide: MainCategoriesUtils,
          useValue: mainCatUtils,
        },
      ],
    }).compile();

    interceptor = module.get<MainCategorySubCategoriesInterceptor>(
      MainCategorySubCategoriesInterceptor,
    );
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  it('should return the sub categories of the given main category', (done) => {
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({}),
      }),
    } as ExecutionContext;

    jest
      .spyOn(mainCatUtils, 'getSubCategories')
      .mockReturnValue(mockMainCat.subCategories);

    const mockCallHandler = {
      handle: () => of(mockMainCat),
    } as CallHandler<any>;

    const result = interceptor.intercept(context, mockCallHandler);

    result.subscribe((subCats) => {
      expect(subCats).toEqual(mockMainCat.subCategories);
      done();
    });
  });
});
