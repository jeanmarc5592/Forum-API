import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AbilityModule } from '@ability/ability.module';

import { MainCategory } from './entities/main-category.entity';
import { MainCategoriesController } from './main-categories.controller';
import { MainCategoriesService } from './main-categories.service';
import { MainCategoriesUtils } from './main-categories.utils';

@Module({
  imports: [TypeOrmModule.forFeature([MainCategory]), AbilityModule],
  controllers: [MainCategoriesController],
  providers: [MainCategoriesService, MainCategoriesUtils],
  exports: [MainCategoriesService],
})
export class MainCategoriesModule {}
