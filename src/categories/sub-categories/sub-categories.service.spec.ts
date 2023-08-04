import { Test, TestingModule } from '@nestjs/testing';
import { SubCategoriesService } from './sub-categories.service';
import { MockType, repositoryMockFactory } from '../../app.types';
import { Repository } from 'typeorm';
import { SubCategory } from './entities/sub-category.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MainCategoriesService } from '../main-categories/main-categories.service';

describe('SubCategoriesService', () => {
  let service: SubCategoriesService;
  let mainCatService: MainCategoriesService;
  let repositoryMock: MockType<Repository<SubCategory>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubCategoriesService,
        {
          provide: getRepositoryToken(SubCategory),
          useFactory: repositoryMockFactory,
        },
        {
          provide: MainCategoriesService,
          useValue: {
            getById: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<SubCategoriesService>(SubCategoriesService);
    mainCatService = module.get<MainCategoriesService>(MainCategoriesService);
    repositoryMock = module.get(getRepositoryToken(SubCategory));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
