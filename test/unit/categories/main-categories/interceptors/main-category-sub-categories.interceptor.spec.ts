import { CallHandler, ExecutionContext } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';

import { MainCategorySubCategoriesInterceptor } from '@categories/main-categories/interceptors/main-category-sub-categories.interceptor';
import { MainCategoriesUtils } from '@categories/main-categories/main-categories.utils';

import { mockMainCat } from '../fixtures/main-categories.fixtures';

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
