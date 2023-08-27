import { CallHandler, ExecutionContext } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';

import { SubCategoryInterceptor } from '@categories/sub-categories/interceptors/sub-category.interceptor';
import { TransformedSubCategory } from '@categories/sub-categories/sub-categories.types';
import { SubCategoriesUtils } from '@categories/sub-categories/sub-categories.utils';

import { mockSubCat } from '../fixtures/sub-categories.fixtures';

const transformedSubCat = {
  id: mockSubCat.id,
  name: mockSubCat.name,
  description: mockSubCat.description,
  mainCategoryId: mockSubCat.mainCategory.id,
} as TransformedSubCategory;

describe('SubCategoryInterceptor', () => {
  let interceptor: SubCategoryInterceptor;
  let subCatUtils: SubCategoriesUtils;

  beforeEach(async () => {
    subCatUtils = {
      transform: jest.fn(),
      getTopics: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubCategoryInterceptor,
        {
          provide: SubCategoriesUtils,
          useValue: subCatUtils,
        },
      ],
    }).compile();

    interceptor = module.get<SubCategoryInterceptor>(SubCategoryInterceptor);
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  it('should transform the sub category in the response', (done) => {
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({}),
      }),
    } as ExecutionContext;

    jest.spyOn(subCatUtils, 'transform').mockReturnValue(transformedSubCat);

    const mockCallHandler = {
      handle: () => of(mockSubCat),
    } as CallHandler<any>;

    const result = interceptor.intercept(context, mockCallHandler);

    result.subscribe((subCat) => {
      expect(subCat).toHaveProperty('id');
      expect(subCat).toHaveProperty('name');
      expect(subCat).toHaveProperty('description');
      expect(subCat).toHaveProperty('mainCategoryId');
      expect(subCat.id).toBe(transformedSubCat.id);
      expect(subCat.name).toBe(transformedSubCat.name);
      expect(subCat.description).toBe(transformedSubCat.description);
      expect(subCat.mainCategoryId).toBe(transformedSubCat.mainCategoryId);
      expect(subCat).not.toHaveProperty('topics');
      done();
    });
  });
});
