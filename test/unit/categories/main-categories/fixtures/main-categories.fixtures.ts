import { Provider } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';

import { MainCategory } from '@categories/main-categories/entities/main-category.entity';
import { MainCategoriesService } from '@categories/main-categories/main-categories.service';
import { SubCategory } from '@categories/sub-categories/entities/sub-category.entity';

import { repositoryMockFactory } from '../../../../test.types';

export const MockMainCategoriesService: Provider = {
  provide: MainCategoriesService,
  useValue: {
    getAll: jest.fn(),
    getById: jest.fn(),
    getSubCategories: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    create: jest.fn(),
  },
};

export const MockMainCategoryRepository: Provider = {
  provide: getRepositoryToken(MainCategory),
  useFactory: repositoryMockFactory,
};

export const mockMainCats = [
  { id: '1', name: 'Main Cat 1' },
  { id: '2', name: 'Main Cat 2' },
  { id: '3', name: 'Main Cat 3' },
] as MainCategory[];

export const mockMainCat: MainCategory = {
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
