import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  UseInterceptors,
  ClassSerializerInterceptor,
  Query,
} from '@nestjs/common';

import { AbilityService } from '@ability/ability.service';
import { RequestUser } from '@auth/auth.types';
import { AccessTokenGuard } from '@auth/guards/access-token.guard';

import { AddModeratorsDTO } from './dtos/add-moderators.dto';
import { CreateSubCategoryDto } from './dtos/create-sub-category.dto';
import { UpdateSubCategoryDto } from './dtos/update-sub-category.dto';
import { SubCategory } from './entities/sub-category.entity';
import { SubCategoryCollectionInterceptor } from './interceptors/sub-category-collection.interceptor';
import { SubCategoryModeratorsInterceptor } from './interceptors/sub-category-moderators.interceptor';
import { SubCategoryTopicsInterceptor } from './interceptors/sub-category-topics.interceptor';
import { SubCategoryInterceptor } from './interceptors/sub-category.interceptor';
import { SubCategoriesService } from './sub-categories.service';
import { SubCategoriesQueryDTO } from '../main-categories/dtos/sub-categories-query.dto';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('sub-categories')
export class SubCategoriesController {
  constructor(
    private readonly subCategoriesService: SubCategoriesService,
    private readonly abilityService: AbilityService,
  ) {}

  @UseInterceptors(SubCategoryCollectionInterceptor)
  @Get()
  getAll(@Query() query: SubCategoriesQueryDTO) {
    const { limit, page } = query;

    return this.subCategoriesService.getAll(limit, page);
  }

  @UseInterceptors(SubCategoryInterceptor)
  @Get('/:id')
  getById(@Param('id') id: string) {
    return this.subCategoriesService.getById(id);
  }

  @UseInterceptors(SubCategoryTopicsInterceptor)
  @Get('/:id/topics')
  getTopics(@Param('id') id: string) {
    return this.subCategoriesService.getTopics(id);
  }

  @Get('/:id/moderators')
  getModerators(@Param('id') id: string) {
    return this.subCategoriesService.getModerators(id);
  }

  @UseGuards(AccessTokenGuard)
  @UseInterceptors(SubCategoryModeratorsInterceptor)
  @Post('/:id/moderators')
  addModerator(
    @Param('id') id: string,
    @Body() body: AddModeratorsDTO,
    @Req() req: { user: RequestUser },
  ) {
    const categoryToUpdate = this.subCategoriesService.getById(id);
    this.abilityService.canUpdate(req.user, body, categoryToUpdate);

    return this.subCategoriesService.addModerator(id, body.userId);
  }

  @UseGuards(AccessTokenGuard)
  @UseInterceptors(SubCategoryModeratorsInterceptor)
  @Delete('/:id/moderators/:userId')
  deleteModerator(
    @Param('id') id: string,
    @Param('userId') userId: string,
    @Req() req: { user: RequestUser },
  ) {
    const categoryToUpdate = this.subCategoriesService.getById(id);
    this.abilityService.canUpdate(
      req.user,
      { moderators: [] },
      categoryToUpdate,
    );

    return this.subCategoriesService.deleteModerator(id, userId);
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
