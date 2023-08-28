import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UsersService } from '@/users/users.service';

import { CreateSubCategoryDto } from './dtos/create-sub-category.dto';
import { UpdateSubCategoryDto } from './dtos/update-sub-category.dto';
import { SubCategory } from './entities/sub-category.entity';
import { MainCategoriesService } from '../main-categories/main-categories.service';

@Injectable()
export class SubCategoriesService {
  constructor(
    @InjectRepository(SubCategory)
    private readonly subCategoriesRepository: Repository<SubCategory>,
    private readonly mainCategoiesService: MainCategoriesService,
    private readonly usersService: UsersService,
  ) {}

  getAll(limit: number, page: number) {
    const skip = (page - 1) * limit;

    return this.subCategoriesRepository
      .createQueryBuilder('subCategory')
      .leftJoinAndSelect('subCategory.mainCategory', 'mainCategory')
      .skip(skip)
      .limit(limit)
      .getMany();
  }

  async getById(id: string) {
    const subCategory = await this.subCategoriesRepository
      .createQueryBuilder('subCategory')
      .leftJoinAndSelect('subCategory.mainCategory', 'mainCategory')
      .where('subCategory.id = :id', { id })
      .getOne();

    if (!subCategory) {
      throw new NotFoundException(`Sub Category with ID '${id}' not found`);
    }

    return subCategory;
  }

  async getTopics(id: string) {
    const subCategory = await this.subCategoriesRepository
      .createQueryBuilder('subCategory')
      .leftJoinAndSelect('subCategory.mainCategory', 'mainCategory')
      .leftJoinAndSelect('subCategory.topics', 'topic')
      .where('subCategory.id = :id', { id })
      .getOne();

    if (!subCategory) {
      throw new NotFoundException(`Sub Category with ID '${id}' not found`);
    }

    return subCategory;
  }

  async getModerators(id: string) {
    const subCategory = await this.subCategoriesRepository
      .createQueryBuilder('subCategory')
      .leftJoinAndSelect('subCategory.moderators', 'moderator')
      .where('subCategory.id = :id', { id })
      .getOne();

    if (!subCategory) {
      throw new NotFoundException(`Sub Category with ID '${id}' not found`);
    }

    // TODO: Add Interceptor for this
    return subCategory.moderators;
  }

  async addModerator(subCatId: string, userId: string) {
    const user = await this.usersService.getById(userId);

    // TODO: Check if user has NOT the role of "user" (utils?)

    const subCategory = await this.subCategoriesRepository
      .createQueryBuilder('subCategory')
      .leftJoinAndSelect('subCategory.moderators', 'moderator')
      .where('subCategory.id = :id', { id: subCatId })
      .getOne();

    if (!subCategory) {
      throw new NotFoundException(
        `Sub Category with ID '${subCatId}' not found`,
      );
    }

    // TODO: Check if user is already a moderator for this sub category (utils?)
    Object.assign(subCategory, {
      moderators: [...subCategory.moderators, user],
    });

    const updatedSubCat = await this.subCategoriesRepository.save(subCategory);

    // TODO: Add Interceptor for this
    return updatedSubCat.moderators;
  }

  async deleteModerator(subCatId: string, userId: string) {
    const subCategory = await this.subCategoriesRepository
      .createQueryBuilder('subCategory')
      .leftJoinAndSelect('subCategory.moderators', 'moderator')
      .where('subCategory.id = :id', { id: subCatId })
      .getOne();

    if (!subCategory) {
      throw new NotFoundException(
        `Sub Category with ID '${subCatId}' not found`,
      );
    }

    // TODO: Check if user is actually in the moderators array

    Object.assign(subCategory, {
      moderators: subCategory.moderators.filter(
        (moderator) => moderator.id !== userId,
      ),
    });

    const updatedSubCat = await this.subCategoriesRepository.save(subCategory);

    // TODO: Add Interceptor for this
    return updatedSubCat.moderators;
  }

  async update(id: string, subCategoryDto: UpdateSubCategoryDto) {
    const subCategory = await this.findById(id);

    Object.assign(subCategory, subCategoryDto);

    return this.subCategoriesRepository.save(subCategory);
  }

  async delete(id: string) {
    const subCategory = await this.findById(id);

    return this.subCategoriesRepository.remove(subCategory);
  }

  async create(subCategoryDto: CreateSubCategoryDto) {
    const { mainCategoryId, name, description } = subCategoryDto;

    const mainCategory = await this.mainCategoiesService.getById(
      mainCategoryId,
    );
    const newSubCat = this.subCategoriesRepository.create({
      name,
      description,
      mainCategory,
    });

    return this.subCategoriesRepository.save(newSubCat);
  }

  private async findById(id: string) {
    const subCategory = await this.subCategoriesRepository.findOneBy({ id });

    if (!subCategory) {
      throw new NotFoundException(`Sub Category with ID '${id}' not found`);
    }

    return subCategory;
  }
}
