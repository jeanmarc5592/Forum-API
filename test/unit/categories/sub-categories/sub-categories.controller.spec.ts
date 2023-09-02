import { Test, TestingModule } from '@nestjs/testing';

import { CreateSubCategoryDto } from '@categories/sub-categories/dtos/create-sub-category.dto';
import { UpdateSubCategoryDto } from '@categories/sub-categories/dtos/update-sub-category.dto';
import { SubCategory } from '@categories/sub-categories/entities/sub-category.entity';
import { SubCategoriesController } from '@categories/sub-categories/sub-categories.controller';
import { SubCategoriesService } from '@categories/sub-categories/sub-categories.service';
import { User } from '@users/entities/user.entity';

import {
  MockSubCategoriesService,
  mockSubCat,
  mockSubCats,
} from './fixtures/sub-categories.fixtures';
import { MockSubCategoriesUtils } from './fixtures/sub-categories.utils.fixtures';
import { MockAbilityService } from '../../ability/fixtures/ability.fixtures';
import { mockRequestWithUser } from '../../auth/fixtures/auth.fixtures';

describe('SubCategoriesController', () => {
  let controller: SubCategoriesController;
  let subCatService: SubCategoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubCategoriesController],
      providers: [
        MockSubCategoriesService,
        MockAbilityService,
        MockSubCategoriesUtils,
      ],
    }).compile();

    controller = module.get<SubCategoriesController>(SubCategoriesController);
    subCatService = module.get<SubCategoriesService>(SubCategoriesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAll', () => {
    it('should return a list of sub categories', async () => {
      jest.spyOn(subCatService, 'getAll').mockResolvedValue(mockSubCats);

      const subCats = await controller.getAll({ page: 1, limit: 10 });

      expect(subCats).toEqual(mockSubCats);
    });
  });

  describe('getById', () => {
    it('should return the sub category with the provided id', async () => {
      jest.spyOn(subCatService, 'getById').mockResolvedValue(mockSubCat);

      const subCat = await controller.getById(mockSubCat.id);

      expect(subCat).toEqual(mockSubCat);
    });
  });

  describe('getTopics', () => {
    it('should return the topics of the sub category with the provided id', async () => {
      const topics = mockSubCat.topics;

      jest.spyOn(subCatService, 'getTopics').mockResolvedValue(mockSubCat);

      const subCat = await controller.getTopics(mockSubCat.id);

      expect(subCat.topics).toEqual(topics);
    });
  });

  describe('getModerators', () => {
    it('should return the moderators of the sub category with the provided id', async () => {
      jest
        .spyOn(subCatService, 'getModerators')
        .mockResolvedValue(mockSubCat.moderators);

      const moderators = await controller.getModerators(mockSubCat.id);

      expect(moderators).toBe(mockSubCat.moderators);
    });
  });

  describe('addModerator', () => {
    it('should return the moderators including the added moderator', async () => {
      const newModerator = { id: '1', name: 'User XYZ' } as User;
      mockSubCat.moderators = mockSubCat.moderators.concat(newModerator);

      jest.spyOn(subCatService, 'addModerator').mockResolvedValue(mockSubCat);

      const subCat = await controller.addModerator(
        mockSubCat.id,
        { userId: newModerator.id },
        mockRequestWithUser,
      );

      expect(subCat.moderators).toEqual(mockSubCat.moderators);
      expect(subCat.moderators).toContain(newModerator);
    });
  });

  describe('deleteModerator', () => {
    it('should return the moderators without the deleted moderator', async () => {
      const deletedModerator = mockSubCat.moderators[0];
      mockSubCat.moderators = mockSubCat.moderators.filter(
        (mod) => mod.id !== deletedModerator.id,
      );

      jest
        .spyOn(subCatService, 'deleteModerator')
        .mockResolvedValue(mockSubCat);

      const subCat = await controller.deleteModerator(
        mockSubCat.id,
        deletedModerator.id,
        mockRequestWithUser,
      );

      expect(subCat.moderators).toBe(mockSubCat.moderators);
      expect(subCat.moderators).not.toContain(deletedModerator);
    });
  });

  describe('update', () => {
    it('should return the updated sub category', async () => {
      const subCatId = mockSubCats[0].id;
      const subCatName = 'Updated Sub Cat';
      const updates: UpdateSubCategoryDto = { name: subCatName };

      Object.assign(mockSubCats[0], updates);
      jest.spyOn(subCatService, 'update').mockResolvedValue(mockSubCats[0]);

      const subCat = await controller.update(
        subCatId,
        {
          name: 'Updated Sub Cat',
        },
        mockRequestWithUser,
      );

      expect(subCat.id).toEqual(subCatId);
      expect(subCat.name).toEqual(subCatName);
    });
  });

  describe('delete', () => {
    it('should return the deleted sub category', async () => {
      const subCatId = mockSubCats[0].id;

      jest.spyOn(subCatService, 'delete').mockResolvedValue(mockSubCats[0]);

      const subCat = await controller.delete(subCatId, mockRequestWithUser);

      expect(subCat.id).toEqual(subCatId);
    });
  });

  describe('create', () => {
    it('should return the created sub category', async () => {
      const subCatBody: CreateSubCategoryDto = {
        name: 'New Main Category',
        description: 'Some Description',
        mainCategoryId: '123',
      };

      const newSubCat = {
        ...subCatBody,
        id: '123',
        created_at: new Date(),
        updated_at: new Date(),
      } as unknown as SubCategory;

      jest.spyOn(subCatService, 'create').mockResolvedValue(newSubCat);

      const subCat = await controller.create(subCatBody, mockRequestWithUser);

      expect(subCat).toEqual(newSubCat);
    });
  });
});
