import { Injectable } from '@nestjs/common';
import { CreateSubCategoryDto } from './dto/create-sub-category.dto';
import { UpdateSubCategoryDto } from './dto/update-sub-category.dto';

@Injectable()
export class SubCategoriesService {
  getAll() {
    return `This action returns all subCategories`;
  }

  getById(id: string) {
    return `This action returns a #${id} subCategory`;
  }

  update(id: string, subCategoryDto: UpdateSubCategoryDto) {
    return `This action updates a #${id} subCategory`;
  }

  delete(id: string) {
    return `This action removes a #${id} subCategory`;
  }

  create(subCategoryDto: CreateSubCategoryDto) {
    return 'This action adds a new subCategory';
  }
}
