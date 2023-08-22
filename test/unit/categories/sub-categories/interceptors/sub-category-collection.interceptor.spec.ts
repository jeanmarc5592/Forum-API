import { Test, TestingModule } from '@nestjs/testing';
import { SubCategoriesUtils } from '../../../../../src/categories/sub-categories/sub-categories.utils';
import { SubCategoryCollectionInterceptor } from '../../../../../src/categories/sub-categories/interceptors/sub-category-collection.interceptor';
import { MainCategory } from '../../../../../src/categories/main-categories/entities/main-category.entity';
import { Topic } from '../../../../../src/topics/entities/topic.entity';
import { SubCategory } from '../../../../../src/categories/sub-categories/entities/sub-category.entity';
import { TransformedSubCategory } from '../../../../../src/categories/sub-categories/sub-categories.types';
import { CallHandler, ExecutionContext } from '@nestjs/common';
import { of } from 'rxjs';

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
} as TransformedSubCategory;

describe('SubCategoryCollectionInterceptor', () => {
  let interceptor: SubCategoryCollectionInterceptor;
  let subCatUtils: SubCategoriesUtils;

  beforeEach(async () => {
    subCatUtils = {
      transform: jest.fn(),
      transformWithTopics: jest.fn(),
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

    jest.spyOn(subCatUtils, 'transform').mockReturnValue(transformedSubCat);

    const mockCallHandler = {
      handle: () => of([mockSubCat]),
    } as CallHandler<any>;

    const result = interceptor.intercept(context, mockCallHandler);

    result.subscribe((subCats) => {
      expect(subCats[0]).toHaveProperty('id');
      expect(subCats[0]).toHaveProperty('name');
      expect(subCats[0]).toHaveProperty('description');
      expect(subCats[0]).toHaveProperty('mainCategoryId');
      expect(subCats[0].id).toBe(transformedSubCat.id);
      expect(subCats[0].name).toBe(transformedSubCat.name);
      expect(subCats[0].description).toBe(transformedSubCat.description);
      expect(subCats[0].mainCategoryId).toBe(transformedSubCat.mainCategoryId);
      expect(subCats[0]).not.toHaveProperty('topics');
      done();
    });
  });
});
