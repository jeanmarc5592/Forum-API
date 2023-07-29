import {
  Controller,
  Param,
  Get,
  Patch,
  Post,
  Delete,
  Body,
} from '@nestjs/common';
import { MainCategoriesService } from './main-categories.service';
import { UpdateMainCategoryDTO } from './dtos/update-main-category.dto';
import { CreateMainCategoryDTO } from './dtos/create-main-category.dto';

@Controller('main-categories')
export class MainCategoriesController {
  constructor(private readonly mainCategoriesService: MainCategoriesService) {}

  @Get()
  getAll() {
    return this.mainCategoriesService.getAll();
  }

  @Get('/:id')
  getById(@Param('id') id: string) {
    return this.mainCategoriesService.getById(id);
  }

  @Patch('/:id')
  update(@Param('id') id: string, @Body() body: UpdateMainCategoryDTO) {
    return this.mainCategoriesService.update(body, id);
  }

  @Delete('/:id')
  delete(@Param('id') id: string) {
    return this.mainCategoriesService.delete(id);
  }

  @Post()
  create(@Body() body: CreateMainCategoryDTO) {
    return this.mainCategoriesService.create(body);
  }
}
