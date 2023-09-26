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

import { RequestUser } from '@/auth/auth.types';
import { AccessTokenGuard } from '@/auth/guards/access-token.guard';
import { ParamUUIDInterceptor } from '@/utils/interceptors/param.uuid.interceptor';

import { CommentsService } from './comments.service';
import { CreateCommentDTO } from './dtos/create-comment.dto';
import { UpdateCommentDTO } from './dtos/update-comment.dto';
import { CommentInterceptor } from './interceptors/comment.interceptor';

@UseInterceptors(CommentInterceptor)
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @UseInterceptors(ParamUUIDInterceptor)
  @Get('/:id')
  getById(@Param('id') id: string) {
    return this.commentsService.getById(id);
  }

  @UseGuards(AccessTokenGuard)
  @UseInterceptors(ParamUUIDInterceptor)
  @Patch('/:id')
  update(@Param('id') id: string, @Body() body: UpdateCommentDTO) {
    return this.commentsService.update(body, id);
  }

  @UseGuards(AccessTokenGuard)
  @UseInterceptors(ParamUUIDInterceptor)
  @Delete('/:id')
  delete(@Param('id') id: string) {
    return this.commentsService.delete(id);
  }

  @UseGuards(AccessTokenGuard)
  @Post()
  create(@Body() body: CreateCommentDTO, @Req() req: { user: RequestUser }) {
    return this.commentsService.create(body, req.user.id);
  }
}
