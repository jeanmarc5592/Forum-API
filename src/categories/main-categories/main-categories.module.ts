import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MainCategory } from './entities/main-category.entity';
import { MainCategoriesController } from './main-categories.controller';
import { MainCategoriesService } from './main-categories.service';

@Module({
  imports: [TypeOrmModule.forFeature([MainCategory])],
  controllers: [MainCategoriesController],
  providers: [MainCategoriesService],
  exports: [MainCategoriesService],
})
export class MainCategoriesModule {}
