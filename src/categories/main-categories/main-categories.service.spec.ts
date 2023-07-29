import { Test, TestingModule } from '@nestjs/testing';
import { MainCategoriesService } from './main-categories.service';

describe('MainCategoriesService', () => {
  let service: MainCategoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MainCategoriesService],
    }).compile();

    service = module.get<MainCategoriesService>(MainCategoriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
