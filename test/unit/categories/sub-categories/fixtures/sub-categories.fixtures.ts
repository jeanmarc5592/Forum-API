import { Provider } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';

import { repositoryMockFactory } from '@/app.types';
import { MainCategory } from '@categories/main-categories/entities/main-category.entity';
import { SubCategory } from '@categories/sub-categories/entities/sub-category.entity';
import { SubCategoriesService } from '@categories/sub-categories/sub-categories.service';
import { Topic } from '@topics/entities/topic.entity';

export const MockSubCategoriesService: Provider = {
  provide: SubCategoriesService,
  useValue: {
    getAll: jest.fn(),
    getById: jest.fn(),
    getTopics: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    create: jest.fn(),
  },
};

export const MockSubCategoriesRepository: Provider = {
  provide: getRepositoryToken(SubCategory),
  useFactory: repositoryMockFactory,
};

export const mockSubCat: SubCategory = {
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

export const mockSubCats = [
  { id: '1', name: 'Sub Cat 1' },
  { id: '2', name: 'Sub Cat 2' },
  { id: '3', name: 'Sub Cat 3' },
] as SubCategory[];
