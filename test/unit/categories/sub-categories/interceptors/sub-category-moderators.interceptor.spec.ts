import { CallHandler, ExecutionContext } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';

import { SubCategoryModeratorsInterceptor } from '@categories/sub-categories/interceptors/sub-category-moderators.interceptor';
import { SubCategoriesUtils } from '@categories/sub-categories/sub-categories.utils';

import { mockSubCat } from '../fixtures/sub-categories.fixtures';

describe('SubCategoryTopicsInterceptor', () => {
  let interceptor: SubCategoryModeratorsInterceptor;
  let subCatUtils: SubCategoriesUtils;

  beforeEach(async () => {
    subCatUtils = {
      transform: jest.fn(),
      getTopics: jest.fn(),
      getModerators: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubCategoryModeratorsInterceptor,
        {
          provide: SubCategoriesUtils,
          useValue: subCatUtils,
        },
      ],
    }).compile();

    interceptor = module.get<SubCategoryModeratorsInterceptor>(
      SubCategoryModeratorsInterceptor,
    );
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  it('should return the moderators of the provided sub category', (done) => {
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({}),
      }),
    } as ExecutionContext;

    jest
      .spyOn(subCatUtils, 'getModerators')
      .mockReturnValue(mockSubCat.moderators);

    const mockCallHandler = {
      handle: () => of(mockSubCat),
    } as CallHandler<any>;

    const result = interceptor.intercept(context, mockCallHandler);

    result.subscribe((moderators) => {
      expect(moderators).toEqual(mockSubCat.moderators);
      done();
    });
  });
});
