import { Test, TestingModule } from '@nestjs/testing';
import { SubCategoriesController } from './sub-categories.controller';
import { SubCategoriesService } from './sub-categories.service';
import { AbilityService } from '../../ability/ability.service';

describe('SubCategoriesController', () => {
  let controller: SubCategoriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubCategoriesController],
      providers: [
        {
          provide: SubCategoriesService,
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
            canCreate: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<SubCategoriesController>(SubCategoriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
