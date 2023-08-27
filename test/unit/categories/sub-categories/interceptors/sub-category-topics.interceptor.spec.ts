import { CallHandler, ExecutionContext } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';

import { SubCategoryTopicsInterceptor } from '@categories/sub-categories/interceptors/sub-category-topics.interceptor';
import { SubCategoriesUtils } from '@categories/sub-categories/sub-categories.utils';

import { mockSubCat } from '../fixtures/sub-categories.fixtures';

describe('SubCategoryTopicsInterceptor', () => {
  let interceptor: SubCategoryTopicsInterceptor;
  let subCatUtils: SubCategoriesUtils;

  beforeEach(async () => {
    subCatUtils = {
      transform: jest.fn(),
      getTopics: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubCategoryTopicsInterceptor,
        {
          provide: SubCategoriesUtils,
          useValue: subCatUtils,
        },
      ],
    }).compile();

    interceptor = module.get<SubCategoryTopicsInterceptor>(
      SubCategoryTopicsInterceptor,
    );
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  it('should return the topics of the provided sub category', (done) => {
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({}),
      }),
    } as ExecutionContext;

    jest.spyOn(subCatUtils, 'getTopics').mockReturnValue(mockSubCat.topics);

    const mockCallHandler = {
      handle: () => of(mockSubCat),
    } as CallHandler<any>;

    const result = interceptor.intercept(context, mockCallHandler);

    result.subscribe((topics) => {
      expect(topics).toEqual(mockSubCat.topics);
      done();
    });
  });
});
