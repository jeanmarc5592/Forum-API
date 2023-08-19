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
import { TopicsService } from './topics.service';
import { CreateTopicDTO } from './dtos/create-topic.dto';
import { UpdateTopicDTO } from './dtos/update-topic.dto';
import { TopicsQueryDTO } from './dtos/topics-query.dto';
import { TopicInterceptor } from './interceptors/topic.interceptor';
import { TopicCollectionInterceptor } from './interceptors/topic-collection.interceptor';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { AbilityService } from '../ability/ability.service';
import { RequestUser } from '../auth/auth.types';
import { Topic } from './entities/topic.entity';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('topics')
export class TopicsController {
  constructor(
    private readonly topicsService: TopicsService,
    private readonly abilityService: AbilityService,
  ) {}

  @UseInterceptors(TopicCollectionInterceptor)
  @Get()
  getAll(@Query() query: TopicsQueryDTO) {
    const { limit, page } = query;

    return this.topicsService.getAll(limit, page);
  }

  @UseInterceptors(TopicInterceptor)
  @Get('/:id')
  getById(@Param('id') id: string) {
    return this.topicsService.getById(id);
  }

  @UseGuards(AccessTokenGuard)
  @Patch('/:id')
  async update(
    @Param('id') id: string,
    @Body() body: UpdateTopicDTO,
    @Req() req: { user: RequestUser },
  ) {
    const topicToUpdate = await this.topicsService.getById(id);
    this.abilityService.canUpdate(req.user, body, topicToUpdate);

    return this.topicsService.update(body, id);
  }

  @UseGuards(AccessTokenGuard)
  @Delete('/:id')
  async delete(@Param('id') id: string, @Req() req: { user: RequestUser }) {
    const topicToDelete = await this.topicsService.getById(id);
    this.abilityService.canDelete(req.user, topicToDelete);

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
