import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { MockType } from 'test/test.types';
import { CreateMainCategoryDTO } from '@categories/main-categories/dtos/create-main-category.dto';
import { UpdateMainCategoryDTO } from '@categories/main-categories/dtos/update-main-category.dto';
import { MainCategory } from '@categories/main-categories/entities/main-category.entity';
import { MainCategoriesService } from '@categories/main-categories/main-categories.service';

import {
  MockMainCategoryRepository,
  mockMainCat,
} from './fixtures/main-categories.fixtures';

describe('MainCategoriesService', () => {
  let service: MainCategoriesService;
  let repositoryMock: MockType<Repository<MainCategory>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MainCategoriesService, MockMainCategoryRepository],
    }).compile();

    service = module.get<MainCategoriesService>(MainCategoriesService);
    repositoryMock = module.get(getRepositoryToken(MainCategory));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAll', () => {
    it('should return a list of main categories', async () => {
      repositoryMock.find?.mockReturnValue([mockMainCat]);

      const mainCats = await service.getAll();

      expect(mainCats).toEqual([mockMainCat]);
    });

    it('should return an empty list', async () => {
      repositoryMock.find?.mockReturnValue([]);

      const mainCats = await service.getAll();

      expect(mainCats).toEqual([]);
    });
  });

  describe('getById', () => {
    it('should return a single main category', async () => {
      repositoryMock.findOneBy?.mockReturnValue(mockMainCat);

      const mainCat = await service.getById(mockMainCat.id);

      expect(mainCat).toEqual(mockMainCat);
    });

    it('should throw a NotFoundException if main category was not found', async () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      repositoryMock.findOneBy?.mockReturnValue(null);

      await expect(service.getById('12334')).rejects.toThrow(NotFoundException);
    });
  });

  describe('getSubCategories', () => {
    it('should return a single main category with sub categories', async () => {
      repositoryMock.createQueryBuilder?.mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(mockMainCat),
      });

      const mainCat = await service.getSubCategories(mockMainCat.id);

      expect(mainCat).toEqual(mockMainCat);
    });

    it('should return an empty list for sub categories', async () => {
      Object.assign(mockMainCat, { subCategories: [] });

      repositoryMock.createQueryBuilder?.mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(mockMainCat),
      });

      const mainCat = await service.getSubCategories(mockMainCat.id);

      expect(mainCat).toEqual(mockMainCat);
      expect(mainCat?.subCategories).toEqual([]);
    });

    it('should throw a NotFoundExpection if main category was not found', async () => {
      repositoryMock.createQueryBuilder?.mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null),
      });

      await expect(service.getSubCategories('12334')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update an existing main category', async () => {
      const updates: UpdateMainCategoryDTO = {
        name: 'Another Main Category',
        description: 'Updated Description',
      };

      repositoryMock.findOneBy?.mockReturnValue(mockMainCat);
      repositoryMock.save?.mockReturnValue({ ...mockMainCat, ...updates });

      const mainCat = await service.update(updates, mockMainCat.id);

      expect(mainCat.name).toBe(updates.name);
      expect(mainCat.description).toBe(updates.description);
    });

    it('should throw a NotFoundException if main category was not found', async () => {
      const updates: UpdateMainCategoryDTO = {
        name: 'Another Main Category',
        description: 'Updated Description',
      };

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      repositoryMock.findOneBy?.mockReturnValue(null);

      await expect(service.update(updates, '12334')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('delete', () => {
    it('should delete an existing main category', async () => {
      repositoryMock.findOneBy?.mockReturnValue(mockMainCat);
      repositoryMock.delete?.mockReturnValue(mockMainCat);

      const mainCat = await service.delete(mockMainCat.id);

      expect(mainCat).toBe(mockMainCat);
    });

    it('should throw a NotFoundException if main category was not found', async () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      repositoryMock.findOneBy?.mockReturnValue(null);

      await expect(service.delete('12334')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a new main category', async () => {
      const mockCreateMainCat: CreateMainCategoryDTO = {
        name: 'New Main Category',
        description: 'Some Description',
      };

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      repositoryMock.findOne?.mockReturnValue(null);
      repositoryMock.create?.mockReturnValue(mockCreateMainCat);
      repositoryMock.save?.mockReturnValue(mockCreateMainCat);

      const mainCat = await service.create(mockCreateMainCat);

      expect(mainCat.name).toBe(mockCreateMainCat.name);
      expect(mainCat.description).toBe(mockCreateMainCat.description);
    });

    it('should throw a BadRequestException if main category already exists', async () => {
      const mockCreateMainCat: CreateMainCategoryDTO = {
        name: 'New Main Category',
        description: 'Some Description',
      };

      repositoryMock.findOne?.mockReturnValue(mockMainCat);

      await expect(service.create(mockCreateMainCat)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
