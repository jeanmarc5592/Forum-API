import { Test, TestingModule } from '@nestjs/testing';
import { MainCategoriesController } from './main-categories.controller';
import { MainCategoriesService } from './main-categories.service';
import { AbilityService } from '../../ability/ability.service';
import { MainCategory } from './entities/main-category.entity';
import { Roles, RequestUser } from '../../auth/auth.types';
import { UpdateMainCategoryDTO } from './dtos/update-main-category.dto';
import { CreateMainCategoryDTO } from './dtos/create-main-category.dto';
import { SubCategory } from '../sub-categories/entities/sub-category.entity';

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
            getWithSubCategories: jest.fn(),
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

  describe('getWithSubCategories', () => {
    it('should return the sub categories of the main category with the provided id', async () => {
      const mainCatId = mockMainCat.id;
      const subCats = mockMainCat.subCategories;

      jest
        .spyOn(mainCatService, 'getWithSubCategories')
        .mockResolvedValue(mockMainCat);

      const mainCat = await controller.getWithSubCategories(mainCatId);

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
