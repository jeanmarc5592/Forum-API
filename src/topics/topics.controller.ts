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
} from '@nestjs/common';
import { TopicsService } from './topics.service';
import { CreateTopicDTO } from './dtos/create-topic.dto';
import { UpdateTopicDTO } from './dtos/update-topic.dto';
import { TopicsQueryDTO } from './dtos/topics-query.dto';
import { TopicInterceptor } from './interceptors/topic.interceptor';
import { TopicCollectionInterceptor } from './interceptors/topic-collection.interceptor';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('topics')
export class TopicsController {
  constructor(private readonly topicsService: TopicsService) {}

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

  @Patch('/:id')
  async update(@Param('id') id: string, @Body() body: UpdateTopicDTO) {
    return this.topicsService.update(body, id);
  }

  @Delete('/:id')
  async delete(@Param('id') id: string) {
    return this.topicsService.delete(id);
  }

  @Post()
  async create(@Body() body: CreateTopicDTO) {
    return this.topicsService.create(body);
  }
}
