import { Test, TestingModule } from '@nestjs/testing';
import { MainCategoriesController } from '@categories/main-categories/main-categories.controller';
import { MainCategoriesService } from '@categories/main-categories/main-categories.service';
import { AbilityService } from '@ability/ability.service';
import { MainCategory } from '@categories/main-categories/entities/main-category.entity';
import { Roles, RequestUser } from '@auth/auth.types';
import { UpdateMainCategoryDTO } from '@categories/main-categories/dtos/update-main-category.dto';
import { CreateMainCategoryDTO } from '@categories/main-categories/dtos/create-main-category.dto';
import { SubCategory } from '@categories/sub-categories/entities/sub-category.entity';
import { MainCategoriesUtils } from '@categories/main-categories/main-categories.utils';

const mockMainCats = [
  { id: '1', name: 'Main Cat 1' },
  { id: '2', name: 'Main Cat 2' },
  { id: '3', name: 'Main Cat 3' },
] as MainCategory[];

const mockMainCat: MainCategory = {
  id: '1',
  name: 'Frontend Development',
  description: 'All About Frontend Development',
  subCategories: [
    {
      id: '1',
      name: 'React',
    } as SubCategory,
    {
      id: '2',
      name: 'Vue',
    } as SubCategory,
  ],
  created_at: new Date(),
  updated_at: new Date(),
  generateId: jest.fn(),
};

const mockRequest = {
  user: {
    id: '123',
    name: 'Request User',
    email: 'requser@email.com',
    role: Roles.USER,
  } as RequestUser,
};

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
            getSubCategories: jest.fn(),
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
        MainCategoriesUtils,
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

      const mainCat = await controller.update(mainCatId, updates, mockRequest);

      expect(mainCat.id).toBe(mainCatId);
      expect(mainCat.name).toBe(mainCatName);
    });
  });

  describe('delete', () => {
    it('should return the deleted main category', async () => {
      const mainCatId = mockMainCat.id;

      jest.spyOn(mainCatService, 'delete').mockResolvedValue(mockMainCat);

      const mainCat = await controller.delete(mainCatId, mockRequest);

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

      const mainCat = await controller.create(mainCatBody, mockRequest);

      expect(mainCat).toEqual(newMainCat);
    });
  });
});
