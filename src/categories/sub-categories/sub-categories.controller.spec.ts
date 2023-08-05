import { Test, TestingModule } from '@nestjs/testing';
import { SubCategoriesController } from './sub-categories.controller';
import { SubCategoriesService } from './sub-categories.service';
import { AbilityService } from '../../ability/ability.service';
import { SubCategory } from './entities/sub-category.entity';
import { UpdateSubCategoryDto } from './dtos/update-sub-category.dto';
import { Roles, RequestUser } from '../../auth/auth.types';
import { CreateSubCategoryDto } from './dtos/create-sub-category.dto';

const mockSubCats = [
  { id: '1', name: 'Sub Cat 1' },
  { id: '2', name: 'Sub Cat 2' },
  { id: '3', name: 'Sub Cat 3' },
] as SubCategory[];

const mockRequest = {
  user: {
    id: '123',
    name: 'Request User',
    email: 'requser@email.com',
    role: Roles.USER,
  } as RequestUser,
};

describe('SubCategoriesController', () => {
  let controller: SubCategoriesController;
  let subCatService: SubCategoriesService;

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
      jest.spyOn(subCatService, 'getById').mockResolvedValue(mockSubCats[0]);

      const subCat = await controller.getById(mockSubCats[0].id);

      expect(subCat).toEqual(mockSubCats[0]);
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
        mockRequest,
      );

      expect(subCat.id).toEqual(subCatId);
      expect(subCat.name).toEqual(subCatName);
    });
  });

  describe('delete', () => {
    it('should return the deleted sub category', async () => {
      const subCatId = mockSubCats[0].id;

      jest.spyOn(subCatService, 'delete').mockResolvedValue(mockSubCats[0]);

      const subCat = await controller.delete(subCatId, mockRequest);

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

      const subCat = await controller.create(subCatBody, mockRequest);

      expect(subCat).toEqual(newSubCat);
    });
  });
});
