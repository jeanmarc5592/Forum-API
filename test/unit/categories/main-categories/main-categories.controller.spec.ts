import { Test, TestingModule } from '@nestjs/testing';

import { CreateMainCategoryDTO } from '@categories/main-categories/dtos/create-main-category.dto';
import { UpdateMainCategoryDTO } from '@categories/main-categories/dtos/update-main-category.dto';
import { MainCategory } from '@categories/main-categories/entities/main-category.entity';
import { MainCategoriesController } from '@categories/main-categories/main-categories.controller';
import { MainCategoriesService } from '@categories/main-categories/main-categories.service';

import {
  mockMainCats,
  mockMainCat,
  MockMainCategoriesService,
} from './fixtures/main-categories.fixtures';
import { MockMainCategoriesUtils } from './fixtures/main-categories.utils.fixtures';
import { MockAbilityService } from '../../ability/fixtures/ability.fixtures';
import { mockRequestWithUser } from '../../auth/fixtures/auth.fixtures';
import { MockHttpUtils } from '../../utils/fixtures/http.utils.fixtures';

describe('MainCategoriesController', () => {
  let controller: MainCategoriesController;
  let mainCatService: MainCategoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MainCategoriesController],
      providers: [
        MockMainCategoriesService,
        MockAbilityService,
        MockMainCategoriesUtils,
        MockHttpUtils,
      ],
    }).compile();

    controller = module.get<MainCategoriesController>(MainCategoriesController);
    mainCatService = module.get<MainCategoriesService>(MainCategoriesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAll', () => {
    it('should return a list of main categories', async () => {
      jest.spyOn(mainCatService, 'getAll').mockResolvedValue(mockMainCats);

      const mainCats = await controller.getAll();

      expect(mainCats).toEqual(mockMainCats);
    });
  });

  describe('getById', () => {
    it('should return the main category with the provided id', async () => {
      jest.spyOn(mainCatService, 'getById').mockResolvedValue(mockMainCat);

      const mainCat = await controller.getById(mockMainCat.id);

      expect(mainCat).toBe(mockMainCat);
    });
  });

  describe('getSubCategories', () => {
    it('should return the main category with the provided id and the sub categories', async () => {
      const subCats = mockMainCat.subCategories;

      jest
        .spyOn(mainCatService, 'getSubCategories')
        .mockResolvedValue(mockMainCat);

      const mainCat = await controller.getSubCategories(mockMainCat.id);

      expect(mainCat?.subCategories).toEqual(subCats);
    });
  });

  describe('update', () => {
    it('should return the updated main category', async () => {
      const mainCatId = mockMainCat.id;
      const mainCatName = 'Updated Name';
      const updates: UpdateMainCategoryDTO = { name: mainCatName };

      Object.assign(mockMainCat, updates);
      jest.spyOn(mainCatService, 'update').mockResolvedValue(mockMainCat);

      const mainCat = await controller.update(
        mainCatId,
        updates,
        mockRequestWithUser,
      );

      expect(mainCat.id).toBe(mainCatId);
      expect(mainCat.name).toBe(mainCatName);
    });
  });

  describe('delete', () => {
    it('should return the deleted main category', async () => {
      const mainCatId = mockMainCat.id;

      jest.spyOn(mainCatService, 'delete').mockResolvedValue(mockMainCat);

      const mainCat = await controller.delete(mainCatId, mockRequestWithUser);

      expect(mainCat).toBe(mockMainCat);
    });
  });

  describe('create', () => {
    it('should return the created main category', async () => {
      const mainCatBody: CreateMainCategoryDTO = {
        name: 'New Main Category',
        description: 'Some Description',
      };

      const newMainCat = {
        ...mainCatBody,
        id: '123',
        created_at: new Date(),
        updated_at: new Date(),
      } as MainCategory;

      jest.spyOn(mainCatService, 'create').mockResolvedValue(newMainCat);

      const mainCat = await controller.create(mainCatBody, mockRequestWithUser);

      expect(mainCat).toEqual(newMainCat);
    });
  });
});
