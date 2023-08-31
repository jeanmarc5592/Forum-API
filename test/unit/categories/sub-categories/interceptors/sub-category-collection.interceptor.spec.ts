import { CallHandler, ExecutionContext } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';

import { SubCategoryCollectionInterceptor } from '@categories/sub-categories/interceptors/sub-category-collection.interceptor';
import { SubCategoriesUtils } from '@categories/sub-categories/sub-categories.utils';

import {
  mockSubCat,
  mockTransformedSubCat,
} from '../fixtures/sub-categories.fixtures';

describe('SubCategoryCollectionInterceptor', () => {
  let interceptor: SubCategoryCollectionInterceptor;
  let subCatUtils: SubCategoriesUtils;

  beforeEach(async () => {
    subCatUtils = {
      transform: jest.fn(),
      getTopics: jest.fn(),
      getModerators: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubCategoryCollectionInterceptor,
        {
          provide: SubCategoriesUtils,
          useValue: subCatUtils,
        },
      ],
    }).compile();

    interceptor = module.get<SubCategoryCollectionInterceptor>(
      SubCategoryCollectionInterceptor,
    );
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  it('should transform the sub categories in the response', (done) => {
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({}),
      }),
    } as ExecutionContext;

    jest.spyOn(subCatUtils, 'transform').mockReturnValue(mockTransformedSubCat);

    const mockCallHandler = {
      handle: () => of([mockSubCat]),
    } as CallHandler<any>;

    const result = interceptor.intercept(context, mockCallHandler);

    result.subscribe((subCats) => {
      expect(subCats[0]).toHaveProperty('id');
      expect(subCats[0]).toHaveProperty('name');
      expect(subCats[0]).toHaveProperty('description');
      expect(subCats[0]).toHaveProperty('mainCategoryId');
      expect(subCats[0].id).toBe(mockTransformedSubCat.id);
      expect(subCats[0].name).toBe(mockTransformedSubCat.name);
      expect(subCats[0].description).toBe(mockTransformedSubCat.description);
      expect(subCats[0].mainCategoryId).toBe(
        mockTransformedSubCat.mainCategoryId,
      );
      expect(subCats[0]).not.toHaveProperty('topics');
      done();
    });
  });
});
