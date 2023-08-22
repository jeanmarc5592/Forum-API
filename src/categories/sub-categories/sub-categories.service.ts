import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSubCategoryDto } from './dtos/create-sub-category.dto';
import { UpdateSubCategoryDto } from './dtos/update-sub-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SubCategory } from './entities/sub-category.entity';
import { Repository } from 'typeorm';
import { MainCategoriesService } from '../main-categories/main-categories.service';

@Injectable()
export class SubCategoriesService {
  constructor(
    @InjectRepository(SubCategory)
    private readonly subCategoriesRepository: Repository<SubCategory>,
    private readonly mainCategoiesService: MainCategoriesService,
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

  async getWithTopics(id: string) {
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
