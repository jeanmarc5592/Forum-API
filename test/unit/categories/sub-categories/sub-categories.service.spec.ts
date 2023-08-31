import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { MockType } from '@/app.types';
import { MainCategoriesService } from '@categories/main-categories/main-categories.service';
import { CreateSubCategoryDto } from '@categories/sub-categories/dtos/create-sub-category.dto';
import { UpdateSubCategoryDto } from '@categories/sub-categories/dtos/update-sub-category.dto';
import { SubCategory } from '@categories/sub-categories/entities/sub-category.entity';
import { SubCategoriesService } from '@categories/sub-categories/sub-categories.service';

import {
  MockSubCategoriesRepository,
  mockSubCat,
} from './fixtures/sub-categories.fixtures';
import { MockUsersService } from '../../users/fixtures/users.fixtures';
import {
  MockMainCategoriesService,
  mockMainCat,
} from '../main-categories/fixtures/main-categories.fixtures';

describe('SubCategoriesService', () => {
  let service: SubCategoriesService;
  let mainCatService: MainCategoriesService;
  let repositoryMock: MockType<Repository<SubCategory>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubCategoriesService,
        MockSubCategoriesRepository,
        MockMainCategoriesService,
        MockUsersService,
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
      repositoryMock.createQueryBuilder?.mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([mockSubCat]),
      });

      const subCats = await service.getAll(10, 1);

      expect(subCats).toEqual([mockSubCat]);
    });

    it('should return an empty list', async () => {
      repositoryMock.createQueryBuilder?.mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([]),
      });

      const subCats = await service.getAll(10, 1);

      expect(subCats).toEqual([]);
    });
  });

  describe('getById', () => {
    it('should return a sub category', async () => {
      repositoryMock.createQueryBuilder?.mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(mockSubCat),
      });

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

  describe('getTopics', () => {
    it('should return a single sub category with topics', async () => {
      repositoryMock.createQueryBuilder?.mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(mockSubCat),
      });

      const subCat = await service.getTopics(mockSubCat.id);

      expect(subCat.topics).toHaveLength(mockSubCat.topics.length);
    });

    it('should return an empty list for topics', async () => {
      Object.assign(mockSubCat, { topics: [] });

      repositoryMock.createQueryBuilder?.mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(mockSubCat),
      });

      const subCat = await service.getTopics(mockSubCat.id);

      expect(subCat.topics).toEqual([]);
    });

    it('should throw a NotFoundExpception if sub category was not found', async () => {
      repositoryMock.createQueryBuilder?.mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null),
      });

      await expect(service.getTopics('12334')).rejects.toThrow(
        NotFoundException,
      );
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
