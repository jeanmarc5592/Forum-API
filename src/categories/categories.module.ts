import { Module } from '@nestjs/common';
import { MainCategoriesController } from './main-categories/main-categories.controller';
import { MainCategoriesService } from './main-categories/main-categories.service';

@Module({
  controllers: [MainCategoriesController],
  providers: [MainCategoriesService],
})
export class CategoriesModule {}
