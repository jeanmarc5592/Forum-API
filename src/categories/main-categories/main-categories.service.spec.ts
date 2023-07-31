import { Test, TestingModule } from '@nestjs/testing';
import { MainCategoriesService } from './main-categories.service';
import { MainCategory } from './entities/main-category.entity';
import { MockType, repositoryMockFactory } from '../../app.types';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('MainCategoriesService', () => {
  let service: MainCategoriesService;
  let repositoryMock: MockType<Repository<MainCategory>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MainCategoriesService,
        {
          provide: getRepositoryToken(MainCategory),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();

    service = module.get<MainCategoriesService>(MainCategoriesService);
    repositoryMock = module.get(getRepositoryToken(MainCategory));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
