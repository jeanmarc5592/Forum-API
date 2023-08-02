import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { SubCategoriesService } from './sub-categories.service';
import { CreateSubCategoryDto } from './dtos/create-sub-category.dto';
import { UpdateSubCategoryDto } from './dtos/update-sub-category.dto';
import { SubCategoriesQueryDTO } from '../main-categories/dtos/sub-categories-query.dto';
import { AccessTokenGuard } from '../../auth/guards/access-token.guard';
import { AbilityService } from '../../ability/ability.service';
import { RequestUser } from '../../auth/auth.types';
import { SubCategory } from './entities/sub-category.entity';

@Controller('sub-categories')
export class SubCategoriesController {
  constructor(
    private readonly subCategoriesService: SubCategoriesService,
    private readonly abilityService: AbilityService,
  ) {}

  @Get()
  getAll(@Query() query: SubCategoriesQueryDTO) {
    return this.subCategoriesService.getAll(query.mainCategory);
  }

  @Get('/:id')
  getById(@Param('id') id: string) {
    return this.subCategoriesService.getById(id);
  }

  @UseGuards(AccessTokenGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() body: UpdateSubCategoryDto,
    @Req() req: { user: RequestUser },
  ) {
    const categoryToUpdate = this.subCategoriesService.getById(id);
    this.abilityService.canUpdate(req.user, body, categoryToUpdate);

    return this.subCategoriesService.update(id, body);
  }

  @UseGuards(AccessTokenGuard)
  @Delete(':id')
  delete(@Param('id') id: string, @Req() req: { user: RequestUser }) {
    const categoryToDelete = this.subCategoriesService.getById(id);
    this.abilityService.canDelete(req.user, categoryToDelete);

    return this.subCategoriesService.delete(id);
  }

  @UseGuards(AccessTokenGuard)
  @Post()
  create(
    @Body() body: CreateSubCategoryDto,
    @Req() req: { user: RequestUser },
  ) {
    this.abilityService.canCreate(req.user, SubCategory);

    return this.subCategoriesService.create(body);
  }
}
