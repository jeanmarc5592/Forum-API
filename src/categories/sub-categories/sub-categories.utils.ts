import { Injectable } from '@nestjs/common';
import { SubCategory } from './entities/sub-category.entity';
import { TransformedSubCategory } from './sub-categories.types';

@Injectable()
export class SubCategoriesUtils {
  transform(subCategory: SubCategory): TransformedSubCategory {
    return {
      id: subCategory.id,
      name: subCategory.name,
      description: subCategory.description,
      mainCategoryId: subCategory.mainCategory.id,
    };
  }

  transformWithTopics(subCategory: SubCategory): TransformedSubCategory {
    return {
      id: subCategory.id,
      name: subCategory.name,
      description: subCategory.description,
      mainCategoryId: subCategory.mainCategory.id,
      topics: subCategory.topics,
    };
  }
}
