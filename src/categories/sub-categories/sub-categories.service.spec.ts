import { Test, TestingModule } from '@nestjs/testing';
import { SubCategoriesService } from './sub-categories.service';
import { MockType, repositoryMockFactory } from '../../app.types';
import { Repository } from 'typeorm';
import { SubCategory } from './entities/sub-category.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MainCategoriesService } from '../main-categories/main-categories.service';
import { MainCategory } from '../main-categories/entities/main-category.entity';
import { NotFoundException } from '@nestjs/common';
import { UpdateSubCategoryDto } from './dtos/update-sub-category.dto';
import { CreateSubCategoryDto } from './dtos/create-sub-category.dto';

const mockSubCat: SubCategory = {
  id: '1',
  name: 'React',
  description: 'All About React',
  mainCategory: {
    id: '1',
    name: 'Frontend Development',
  } as MainCategory,
  created_at: new Date(),
  updated_at: new Date(),
  generateId: jest.fn(),
};

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

  describe('getAll', () => {
    it('should return a list of sub categories', async () => {
      repositoryMock.find?.mockReturnValue([mockSubCat]);

      const subCats = await service.getAll(10, 1);

      expect(subCats).toEqual([mockSubCat]);
    });

    it('should return an empty list', async () => {
      repositoryMock.find?.mockReturnValue([]);

      const subCats = await service.getAll(10, 1);

      expect(subCats).toEqual([]);
    });
  });

  describe('getById', () => {
    it('should return a sub category', async () => {
      repositoryMock.findOneBy?.mockReturnValue(mockSubCat);

      const subCat = await service.getById(mockSubCat.id);

      expect(subCat).toEqual(mockSubCat);
    });

    it('should throw a NotFoundException if sub category was not found', async () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      repositoryMock.findOneBy?.mockReturnValue(null);

      await expect(service.getById('12334')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a sub category', async () => {
      const updates: UpdateSubCategoryDto = {
        name: 'Vue',
        description: 'All About Vue',
      };

      repositoryMock.findOneBy?.mockReturnValue(mockSubCat);
      repositoryMock.save?.mockReturnValue({ ...mockSubCat, ...updates });

      const subCat = await service.update(mockSubCat.id, updates);

      expect(subCat).toEqual(mockSubCat);
    });

    it('should throw a NotFoundException if sub category was not found', async () => {
      const updates: UpdateSubCategoryDto = {
        name: 'Vue',
        description: 'All About Vue',
      };

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      repositoryMock.findOneBy?.mockReturnValue(null);

      await expect(service.update('123', updates)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('delete', () => {
    it('should delete a sub category', async () => {
      repositoryMock.findOneBy?.mockReturnValue(mockSubCat);
      repositoryMock.delete?.mockReturnValue(mockSubCat);

      const subCat = await service.delete(mockSubCat.id);

      expect(subCat).toEqual(mockSubCat);
    });

    it('should throw a NotFoundException if sub category was not found', async () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      repositoryMock.findOneBy?.mockReturnValue(null);

      await expect(service.delete('12334')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a sub category', async () => {
      const newSubCat: CreateSubCategoryDto = {
        name: 'Vue',
        description: 'All About Vue',
        mainCategoryId: '1',
      };

      jest.spyOn(mainCatService, 'getById').mockResolvedValue(mockMainCat);

      repositoryMock.create?.mockReturnValue(newSubCat);
      repositoryMock.save?.mockReturnValue({ ...newSubCat, id: '123' });

      const subCat = await service.create(newSubCat);

      expect(subCat).toEqual({ ...newSubCat, id: '123' });
    });
  });
});
