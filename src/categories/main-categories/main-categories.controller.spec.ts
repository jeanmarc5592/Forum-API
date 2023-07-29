import { Test, TestingModule } from '@nestjs/testing';
import { MainCategoriesController } from './main-categories.controller';

describe('MainCategoriesController', () => {
  let controller: MainCategoriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MainCategoriesController],
    }).compile();

    controller = module.get<MainCategoriesController>(MainCategoriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
