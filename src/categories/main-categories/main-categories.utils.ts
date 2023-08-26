import { Injectable } from '@nestjs/common';

import { MainCategory } from './entities/main-category.entity';
import { SubCategory } from '../sub-categories/entities/sub-category.entity';

@Injectable()
export class MainCategoriesUtils {
  getSubCategories(mainCategory: MainCategory): SubCategory[] {
    return mainCategory.subCategories;
  }
}
