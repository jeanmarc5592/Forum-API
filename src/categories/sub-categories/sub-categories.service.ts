import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSubCategoryDto } from './dtos/create-sub-category.dto';
import { UpdateSubCategoryDto } from './dtos/update-sub-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SubCategory } from './entities/sub-category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SubCategoriesService {
  constructor(
    @InjectRepository(SubCategory)
    private readonly subCategoriesRepository: Repository<SubCategory>,
  ) {}

  getAll() {
    return `This action returns all subCategories`;
  }

  async getById(id: string) {
    return await this.findById(id);
  }

  update(id: string, subCategoryDto: UpdateSubCategoryDto) {
    return `This action updates a #${id} subCategory`;
  }

  delete(id: string) {
    return `This action removes a #${id} subCategory`;
  }

  async create(subCategoryDto: CreateSubCategoryDto) {
    const newSubCat = this.subCategoriesRepository.create(subCategoryDto);

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
