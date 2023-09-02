import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { MockType } from '@/app.types';
import { Roles } from '@auth/auth.types';
import { MainCategoriesService } from '@categories/main-categories/main-categories.service';
import { CreateSubCategoryDto } from '@categories/sub-categories/dtos/create-sub-category.dto';
import { UpdateSubCategoryDto } from '@categories/sub-categories/dtos/update-sub-category.dto';
import { SubCategory } from '@categories/sub-categories/entities/sub-category.entity';
import { SubCategoriesService } from '@categories/sub-categories/sub-categories.service';
import { User } from '@users/entities/user.entity';
import { UsersService } from '@users/users.service';

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
  let usersService: UsersService;

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
    usersService = module.get<UsersService>(UsersService);
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

  describe('getModerators', () => {
    it('should return the moderators of the given sub category', async () => {
      repositoryMock.createQueryBuilder?.mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(mockSubCat),
      });

      const moderators = await service.getModerators(mockSubCat.id);

      expect(moderators).toEqual(mockSubCat.moderators);
    });

    it('should return an empty list for moderators', async () => {
      Object.assign(mockSubCat, { moderators: [] });

      repositoryMock.createQueryBuilder?.mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(mockSubCat),
      });

      const moderators = await service.getModerators(mockSubCat.id);

      expect(moderators).toEqual([]);
    });

    it('should throw a NotFoundExpception if sub category was not found', async () => {
      repositoryMock.createQueryBuilder?.mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null),
      });

      await expect(service.getModerators('12334')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('addModerator', () => {
    it('should add a new moderator', async () => {
      const newModerator = {
        id: '123',
        name: 'New Moderator',
        role: Roles.MODERATOR,
      } as User;
      jest.spyOn(usersService, 'getById').mockResolvedValue(newModerator);

      repositoryMock.createQueryBuilder?.mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(mockSubCat),
      });

      const updatedSubCat = {
        ...mockSubCat,
        moderators: mockSubCat.moderators.concat(newModerator),
      };
      repositoryMock.save?.mockReturnValue(updatedSubCat);

      const subCat = await service.addModerator(mockSubCat.id, newModerator.id);

      expect(subCat.moderators).toContain(newModerator);
    });

    it('should throw BadRequestException if user has not a moderator role', async () => {
      const newModerator = {
        id: '123',
        name: 'New Moderator',
        role: Roles.USER,
      } as User;
      jest.spyOn(usersService, 'getById').mockResolvedValue(newModerator);

      await expect(
        service.addModerator(mockSubCat.id, newModerator.id),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException if the sub category was not found', async () => {
      const newModerator = {
        id: '123',
        name: 'New Moderator',
        role: Roles.MODERATOR,
      } as User;
      jest.spyOn(usersService, 'getById').mockResolvedValue(newModerator);

      repositoryMock.createQueryBuilder?.mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null),
      });

      await expect(
        service.addModerator('123456', newModerator.id),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if user is already a moderator', async () => {
      const newModerator = {
        id: '123',
        name: 'New Moderator',
        role: Roles.MODERATOR,
      } as User;
      jest.spyOn(usersService, 'getById').mockResolvedValue(newModerator);

      Object.assign(mockSubCat, {
        moderators: mockSubCat.moderators.concat(newModerator),
      });

      repositoryMock.createQueryBuilder?.mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(mockSubCat),
      });

      await expect(
        service.addModerator(mockSubCat.id, newModerator.id),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('deleteModerator', () => {
    it('should delete a moderator', async () => {
      repositoryMock.createQueryBuilder?.mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(mockSubCat),
      });

      const updatedSubCat = {
        ...mockSubCat,
        moderators: [],
      };
      repositoryMock.save?.mockReturnValue(updatedSubCat);

      const moderatorToDelete = mockSubCat.moderators[0];

      const subCat = await service.deleteModerator(
        mockSubCat.id,
        moderatorToDelete.id,
      );

      expect(subCat.moderators).not.toContain(moderatorToDelete);
    });

    it('should throw a NotFoundException if sub category was not found', async () => {
      repositoryMock.createQueryBuilder?.mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null),
      });

      await expect(
        service.deleteModerator('123456', '42232342'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw a BadRequestException if user is not a moderator', async () => {
      repositoryMock.createQueryBuilder?.mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(mockSubCat),
      });

      await expect(
        service.deleteModerator('123456', '42232342'),
      ).rejects.toThrow(BadRequestException);
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
