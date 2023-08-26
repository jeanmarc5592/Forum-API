import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateMainCategoryDTO } from './dtos/create-main-category.dto';
import { UpdateMainCategoryDTO } from './dtos/update-main-category.dto';
import { MainCategory } from './entities/main-category.entity';

@Injectable()
export class MainCategoriesService {
  constructor(
    @InjectRepository(MainCategory)
    private readonly mainCategoriesRepository: Repository<MainCategory>,
  ) {}

  async getAll() {
    return this.mainCategoriesRepository.find();
  }

  async getById(id: string) {
    return await this.findById(id);
  }

  async getSubCategories(id: string) {
    const mainCategory = await this.mainCategoriesRepository
      .createQueryBuilder('mainCategory')
      .leftJoinAndSelect('mainCategory.subCategories', 'subCategory')
      .where('mainCategory.id = :id', { id })
      .getOne();

    if (!mainCategory) {
      throw new NotFoundException(`Main Category with id '${id}' not found.`);
    }

    return mainCategory;
  }

  async update(mainCategoryDTO: UpdateMainCategoryDTO, id: string) {
    const mainCategory = await this.findById(id);

    Object.assign(mainCategory, mainCategoryDTO);

    return await this.mainCategoriesRepository.save(mainCategory);
  }

  async delete(id: string) {
    const mainCategory = await this.findById(id);

    return this.mainCategoriesRepository.remove(mainCategory);
  }

  async create(mainCategoryDTO: CreateMainCategoryDTO) {
    const { name } = mainCategoryDTO;

    const mainCategory = await this.mainCategoriesRepository.findOne({
      where: [{ name }],
    });

    if (mainCategory) {
      throw new BadRequestException(
        `A main category with the name '${name}' already exists.`,
      );
    }

    const newMainCat = this.mainCategoriesRepository.create(mainCategoryDTO);

    return this.mainCategoriesRepository.save(newMainCat);
  }

  private async findById(id: string) {
    const mainCategory = await this.mainCategoriesRepository.findOneBy({ id });

    if (!mainCategory) {
      throw new NotFoundException(`Main Category with id '${id}' not found.`);
    }

    return mainCategory;
  }
}
