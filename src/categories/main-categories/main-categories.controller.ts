import { Controller, Param, Get, Patch, Post, Delete } from '@nestjs/common';
import { MainCategoriesService } from './main-categories.service';

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
  update(@Param('id') id: string) {
    return this.mainCategoriesService.update(id);
  }

  @Post()
  add() {
    return this.mainCategoriesService.add();
  }

  @Delete('/:id')
  delete(@Param('id') id: string) {
    return this.mainCategoriesService.delete(id);
  }
}
