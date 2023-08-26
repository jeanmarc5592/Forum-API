import { Module } from '@nestjs/common';

import { MainCategoriesModule } from './main-categories/main-categories.module';
import { SubCategoriesModule } from './sub-categories/sub-categories.module';

@Module({
  imports: [MainCategoriesModule, SubCategoriesModule],
})
export class CategoriesModule {}
