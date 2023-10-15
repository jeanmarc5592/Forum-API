import {
  Controller,
  Get,
  Param,
  Patch,
  Body,
  Delete,
  Post,
  Query,
  UseInterceptors,
  ClassSerializerInterceptor,
  UseGuards,
  Req,
} from '@nestjs/common';

import { PaginationQueryDTO } from '@/utils/dtos/pagination-query.dto';
import { ParamUUIDInterceptor } from '@/utils/interceptors/param.uuid.interceptor';
import { AbilityService } from '@ability/ability.service';
import { RequestUser } from '@auth/auth.types';
import { AccessTokenGuard } from '@auth/guards/access-token.guard';

import { CreateTopicDTO } from './dtos/create-topic.dto';
import { UpdateTopicDTO } from './dtos/update-topic.dto';
import { Topic } from './entities/topic.entity';
import { TopicCollectionInterceptor } from './interceptors/topic-collection.interceptor';
import { TopicCommentsInterceptor } from './interceptors/topic-comments.interceptor';
import { TopicInterceptor } from './interceptors/topic.interceptor';
import { TopicsAbilityService } from './topics.ability.service';
import { TopicsService } from './topics.service';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('topics')
export class TopicsController {
  constructor(
    private readonly topicsService: TopicsService,
    private readonly abilityService: AbilityService,
    private readonly topicsAbilityService: TopicsAbilityService,
  ) {}

  @UseInterceptors(TopicCollectionInterceptor)
  @Get()
  getAll(@Query() query: PaginationQueryDTO) {
    const { limit, page } = query;

    return this.topicsService.getAll(limit, page);
  }

  @UseInterceptors(TopicInterceptor, ParamUUIDInterceptor)
  @Get('/:id')
  getById(@Param('id') id: string) {
    return this.topicsService.getById(id);
  }

  @UseInterceptors(TopicCommentsInterceptor, ParamUUIDInterceptor)
  @Get('/:id/comments')
  getComments(@Param('id') id: string, @Query() query: PaginationQueryDTO) {
    const { limit, page } = query;

    return this.topicsService.getComments(id, limit, page);
  }

  @UseInterceptors(ParamUUIDInterceptor)
  @UseGuards(AccessTokenGuard)
  @Patch('/:id')
  async update(
    @Param('id') id: string,
    @Body() body: UpdateTopicDTO,
    @Req() req: { user: RequestUser },
  ) {
    const topicToUpdate = await this.topicsService.getById(id);

    if (topicToUpdate.user.id === req.user.id) {
      this.abilityService.canUpdate(req.user, body, topicToUpdate);
    } else {
      await this.topicsAbilityService.canManage(req.user, topicToUpdate);
    }

    return this.topicsService.update(body, id);
  }

  @UseInterceptors(ParamUUIDInterceptor)
  @UseGuards(AccessTokenGuard)
  @Delete('/:id')
  async delete(@Param('id') id: string, @Req() req: { user: RequestUser }) {
    const topicToDelete = await this.topicsService.getById(id);

    if (topicToDelete.user.id === req.user.id) {
      this.abilityService.canDelete(req.user, topicToDelete);
    } else {
      await this.topicsAbilityService.canManage(req.user, topicToDelete);
    }

    return this.topicsService.delete(id);
  }

  @UseGuards(AccessTokenGuard)
  @UseInterceptors(TopicInterceptor)
  @Post()
  async create(
    @Body() body: CreateTopicDTO,
    @Req() req: { user: RequestUser },
  ) {
    this.abilityService.canCreate(req.user, Topic);

    return this.topicsService.create(body, req.user.id);
  }
}
