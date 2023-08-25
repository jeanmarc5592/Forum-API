import { Test, TestingModule } from '@nestjs/testing';
import { SubCategoriesUtils } from '@categories/sub-categories/sub-categories.utils';
import { SubCategoryTopicsInterceptor } from '@categories/sub-categories/interceptors/sub-category-topics.interceptor';
import { MainCategory } from '@categories/main-categories/entities/main-category.entity';
import { Topic } from '@topics/entities/topic.entity';
import { SubCategory } from '@categories/sub-categories/entities/sub-category.entity';
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

describe('SubCategoryTopicsInterceptor', () => {
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

  it('should return the topics of the provided sub category', (done) => {
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({}),
      }),
    } as ExecutionContext;

    jest
      .spyOn(subCatUtils, 'transformWithTopics')
      .mockReturnValue(mockSubCat.topics);

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
