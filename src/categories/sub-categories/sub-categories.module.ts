import { Module } from '@nestjs/common';
import { SubCategoriesService } from './sub-categories.service';
import { SubCategoriesController } from './sub-categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubCategory } from './entities/sub-category.entity';
import { MainCategoriesModule } from '../main-categories/main-categories.module';
import { AbilityModule } from '@ability/ability.module';
import { SubCategoriesUtils } from './sub-categories.utils';

@Module({
  imports: [
    TypeOrmModule.forFeature([SubCategory]),
    MainCategoriesModule,
    AbilityModule,
  ],
  controllers: [SubCategoriesController],
  providers: [SubCategoriesService, SubCategoriesUtils],
  exports: [SubCategoriesService],
})
export class SubCategoriesModule {}
