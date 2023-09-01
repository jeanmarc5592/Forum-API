import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Roles } from '@auth/auth.types';
import { UsersService } from '@users/users.service';

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

    return subCategory.moderators;
  }

  async addModerator(subCatId: string, userId: string) {
    const user = await this.usersService.getById(userId);

    if (user.role !== Roles.MODERATOR) {
      throw new BadRequestException(
        `User has to have the '${Roles.MODERATOR}' role in order to be added. Role '${user.role}' given.`,
      );
    }

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

    const isAlreadyModerator = !!subCategory.moderators.find(
      (moderator) => moderator.id == userId,
    );

    if (isAlreadyModerator) {
      throw new BadRequestException(
        `User with the ID '${userId}' is already a moderator in this sub category.`,
      );
    }

    Object.assign(subCategory, {
      moderators: [...subCategory.moderators, user],
    });

    return this.subCategoriesRepository.save(subCategory);
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

    const isModerator = !!subCategory.moderators.find(
      (moderator) => moderator.id == userId,
    );

    if (!isModerator) {
      throw new BadRequestException(
        `User with the ID '${userId}' is not a moderator for this sub category.`,
      );
    }

    Object.assign(subCategory, {
      moderators: subCategory.moderators.filter(
        (moderator) => moderator.id !== userId,
      ),
    });

    return this.subCategoriesRepository.save(subCategory);
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
