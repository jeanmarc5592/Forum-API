import { Test, TestingModule } from '@nestjs/testing';
import { SubCategoriesUtils } from '../../../../../src/categories/sub-categories/sub-categories.utils';
import { SubCategoryTopicsInterceptor } from '../../../../../src/categories/sub-categories/interceptors/sub-category-topics.interceptor';
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
  topics: mockSubCat.topics,
} as TransformedSubCategory;

describe('SubCategoryInterceptor', () => {
  let interceptor: SubCategoryTopicsInterceptor;
  let subCatUtils: SubCategoriesUtils;

  beforeEach(async () => {
    subCatUtils = {
      transform: jest.fn(),
      transformWithTopics: jest.fn(),
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

  it('should transform the sub category in the response with topics', (done) => {
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({}),
      }),
    } as ExecutionContext;

    jest
      .spyOn(subCatUtils, 'transformWithTopics')
      .mockReturnValue(transformedSubCat);

    const mockCallHandler = {
      handle: () => of(mockSubCat),
    } as CallHandler<any>;

    const result = interceptor.intercept(context, mockCallHandler);

    result.subscribe((subCat) => {
      expect(subCat).toHaveProperty('id');
      expect(subCat).toHaveProperty('name');
      expect(subCat).toHaveProperty('description');
      expect(subCat).toHaveProperty('mainCategoryId');
      expect(subCat).toHaveProperty('topics');
      expect(subCat.id).toBe(transformedSubCat.id);
      expect(subCat.name).toBe(transformedSubCat.name);
      expect(subCat.description).toBe(transformedSubCat.description);
      expect(subCat.mainCategoryId).toBe(transformedSubCat.mainCategoryId);
      expect(subCat.topics).toBe(transformedSubCat.topics);
      done();
    });
  });
});
