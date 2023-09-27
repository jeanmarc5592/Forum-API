import {
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Body,
  Req,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';

import { AbilityService } from '@/ability/ability.service';
import { RequestUser } from '@/auth/auth.types';
import { AccessTokenGuard } from '@/auth/guards/access-token.guard';
import { TopicsAbilityService } from '@/topics/topics.ability.service';
import { TopicsService } from '@/topics/topics.service';
import { ParamUUIDInterceptor } from '@/utils/interceptors/param.uuid.interceptor';

import { CommentsService } from './comments.service';
import { CreateCommentDTO } from './dtos/create-comment.dto';
import { UpdateCommentDTO } from './dtos/update-comment.dto';
import { Comment } from './entities/comment.entity';
import { CommentInterceptor } from './interceptors/comment.interceptor';

@UseInterceptors(CommentInterceptor)
@Controller('comments')
export class CommentsController {
  constructor(
    private readonly commentsService: CommentsService,
    private readonly abilityService: AbilityService,
    private readonly topicsService: TopicsService,
    private readonly topicsAbilityService: TopicsAbilityService,
  ) {}

  @UseInterceptors(ParamUUIDInterceptor)
  @Get('/:id')
  getById(@Param('id') id: string) {
    return this.commentsService.getById(id);
  }

  @UseGuards(AccessTokenGuard)
  @UseInterceptors(ParamUUIDInterceptor)
  @Patch('/:id')
  async update(
    @Param('id') id: string,
    @Body() body: UpdateCommentDTO,
    @Req() req: { user: RequestUser },
  ) {
    const commentToUpdate = await this.commentsService.getById(id);

    if (commentToUpdate.user.id === req.user.id) {
      this.abilityService.canUpdate(req.user, body, commentToUpdate);
    } else {
      // When another user makes the request, it should be checked if it's moderator of the sub category where the topic is in
      const topic = await this.topicsService.getById(commentToUpdate.topic.id);
      await this.topicsAbilityService.canManage(req.user, topic);
    }

    return this.commentsService.update(body, id);
  }

  @UseGuards(AccessTokenGuard)
  @UseInterceptors(ParamUUIDInterceptor)
  @Delete('/:id')
  async delete(@Param('id') id: string, @Req() req: { user: RequestUser }) {
    const commentToDelete = await this.commentsService.getById(id);

    if (commentToDelete.user.id === req.user.id) {
      this.abilityService.canDelete(req.user, commentToDelete);
    } else {
      // When another user makes the request, it should be checked if it's moderator of the sub category where the topic is in
      const topic = await this.topicsService.getById(commentToDelete.topic.id);
      await this.topicsAbilityService.canManage(req.user, topic);
    }

    return this.commentsService.delete(id);
  }

  @UseGuards(AccessTokenGuard)
  @Post()
  create(@Body() body: CreateCommentDTO, @Req() req: { user: RequestUser }) {
    this.abilityService.canCreate(req.user, Comment);

    return this.commentsService.create(body, req.user.id);
  }
}
