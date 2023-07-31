import { Test, TestingModule } from '@nestjs/testing';
import { MainCategoriesController } from './main-categories.controller';
import { MainCategoriesService } from './main-categories.service';
import { AbilityService } from '../../ability/ability.service';

describe('MainCategoriesController', () => {
  let controller: MainCategoriesController;
  let mainCatService: MainCategoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MainCategoriesController],
      providers: [
        {
          provide: MainCategoriesService,
          useValue: {
            getAll: jest.fn(),
            getById: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: AbilityService,
          useValue: {
            canUpdate: jest.fn(),
            canDelete: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<MainCategoriesController>(MainCategoriesController);
    mainCatService = module.get<MainCategoriesService>(MainCategoriesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
