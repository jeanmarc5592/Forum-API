import {
  Controller,
  Param,
  Get,
  Patch,
  Post,
  Delete,
  Body,
  UseGuards,
  Req,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';

import { ParamUUIDInterceptor } from '@/utils/interceptors/param.uuid.interceptor';
import { AbilityService } from '@ability/ability.service';
import { RequestUser } from '@auth/auth.types';
import { AccessTokenGuard } from '@auth/guards/access-token.guard';

import { CreateMainCategoryDTO } from './dtos/create-main-category.dto';
import { UpdateMainCategoryDTO } from './dtos/update-main-category.dto';
import { MainCategory } from './entities/main-category.entity';
import { MainCategorySubCategoriesInterceptor } from './interceptors/main-category-sub-categories.interceptor';
import { MainCategoriesService } from './main-categories.service';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('main-categories')
export class MainCategoriesController {
  constructor(
    private readonly mainCategoriesService: MainCategoriesService,
    private readonly abilityService: AbilityService,
  ) {}

  @Get()
  getAll() {
    return this.mainCategoriesService.getAll();
  }

  @UseInterceptors(ParamUUIDInterceptor)
  @Get('/:id')
  getById(@Param('id') id: string) {
    return this.mainCategoriesService.getById(id);
  }

  @UseInterceptors(MainCategorySubCategoriesInterceptor, ParamUUIDInterceptor)
  @Get('/:id/sub-categories')
  getSubCategories(@Param('id') id: string) {
    return this.mainCategoriesService.getSubCategories(id);
  }

  @UseInterceptors(ParamUUIDInterceptor)
  @UseGuards(AccessTokenGuard)
  @Patch('/:id')
  async update(
    @Param('id') id: string,
    @Body() body: UpdateMainCategoryDTO,
    @Req() req: { user: RequestUser },
  ) {
    const categoryToUpdate = await this.mainCategoriesService.getById(id);
    this.abilityService.canUpdate(req.user, body, categoryToUpdate);

    return this.mainCategoriesService.update(body, id);
  }

  @UseInterceptors(ParamUUIDInterceptor)
  @UseGuards(AccessTokenGuard)
  @Delete('/:id')
  async delete(@Param('id') id: string, @Req() req: { user: RequestUser }) {
    const categoryToDelete = await this.mainCategoriesService.getById(id);
    this.abilityService.canDelete(req.user, categoryToDelete);

    return this.mainCategoriesService.delete(id);
  }

  @UseGuards(AccessTokenGuard)
  @Post()
  create(
    @Body() body: CreateMainCategoryDTO,
    @Req() req: { user: RequestUser },
  ) {
    this.abilityService.canCreate(req.user, MainCategory);

    return this.mainCategoriesService.create(body);
  }
}
