import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { SubCategoriesService } from './sub-categories.service';
import { CreateSubCategoryDto } from './dtos/create-sub-category.dto';
import { UpdateSubCategoryDto } from './dtos/update-sub-category.dto';
import { SubCategoriesQueryDTO } from '../main-categories/dtos/sub-categories-query.dto';

@Controller('sub-categories')
export class SubCategoriesController {
  constructor(private readonly subCategoriesService: SubCategoriesService) {}

  @Get()
  getAll(@Query() query: SubCategoriesQueryDTO) {
    return this.subCategoriesService.getAll(query.mainCategory);
  }

  @Get('/:id')
  getById(@Param('id') id: string) {
    return this.subCategoriesService.getById(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSubCategoryDto: UpdateSubCategoryDto,
  ) {
    return this.subCategoriesService.update(id, updateSubCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subCategoriesService.delete(id);
  }

  @Post()
  create(@Body() body: CreateSubCategoryDto) {
    return this.subCategoriesService.create(body);
  }
}
