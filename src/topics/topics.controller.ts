import {
  Controller,
  Get,
  Param,
  Patch,
  Body,
  Delete,
  Post,
  Query,
} from '@nestjs/common';
import { TopicsService } from './topics.service';
import { CreateTopicDTO } from './dtos/create-topic.dto';
import { UpdateTopicDTO } from './dtos/update-topic.dto';
import { TopicsQueryDTO } from './dtos/topics-query.dto';

@Controller('topics')
export class TopicsController {
  constructor(private readonly topicsService: TopicsService) {}

  @Get()
  getAll(@Query() query: TopicsQueryDTO) {
    const { limit, page } = query;

    return this.topicsService.getAll(limit, page);
  }

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
