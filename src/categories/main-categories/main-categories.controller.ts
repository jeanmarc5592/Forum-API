import {
  Controller,
  Param,
  Get,
  Patch,
  Post,
  Delete,
  Body,
  UseGuards,
} from '@nestjs/common';
import { MainCategoriesService } from './main-categories.service';
import { UpdateMainCategoryDTO } from './dtos/update-main-category.dto';
import { CreateMainCategoryDTO } from './dtos/create-main-category.dto';
import { AccessTokenGuard } from 'src/auth/guards/access-token.guard';

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

  @UseGuards(AccessTokenGuard)
  @Patch('/:id')
  update(@Param('id') id: string, @Body() body: UpdateMainCategoryDTO) {
    return this.mainCategoriesService.update(body, id);
  }

  @UseGuards(AccessTokenGuard)
  @Delete('/:id')
  delete(@Param('id') id: string) {
    return this.mainCategoriesService.delete(id);
  }

  @UseGuards(AccessTokenGuard)
  @Post()
  create(@Body() body: CreateMainCategoryDTO) {
    return this.mainCategoriesService.create(body);
  }
}
