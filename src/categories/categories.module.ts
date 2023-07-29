import { Module } from '@nestjs/common';
import { MainCategoriesModule } from './main-categories/main-categories.module';

@Module({
  imports: [MainCategoriesModule],
})
export class CategoriesModule {}
