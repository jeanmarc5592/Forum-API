import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from '@/users/users.module';
import { AbilityModule } from '@ability/ability.module';

import { SubCategory } from './entities/sub-category.entity';
import { SubCategoriesController } from './sub-categories.controller';
import { SubCategoriesService } from './sub-categories.service';
import { SubCategoriesUtils } from './sub-categories.utils';
import { MainCategoriesModule } from '../main-categories/main-categories.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SubCategory]),
    MainCategoriesModule,
    AbilityModule,
    UsersModule,
  ],
  controllers: [SubCategoriesController],
  providers: [SubCategoriesService, SubCategoriesUtils],
  exports: [SubCategoriesService],
})
export class SubCategoriesModule {}
