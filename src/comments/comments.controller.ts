import {
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Body,
  Req,
} from '@nestjs/common';

import { RequestUser } from '@/auth/auth.types';

import { CommentsService } from './comments.service';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get('/:id')
  getById(@Param('id') id: string) {
    return this.commentsService.getById(id);
  }

  @Patch('/:id')
  update(
    @Param('id') id: string,
    @Body() body: object,
    @Req() req: { user: RequestUser },
  ) {
    return this.commentsService.update(body, id);
  }

  @Delete('/:id')
  delete(@Param('id') id: string, @Req() req: { user: RequestUser }) {
    return this.commentsService.delete(id);
  }

  @Post()
  create(@Body() body: object, @Req() req: { user: RequestUser }) {
    return this.commentsService.create(body, req.user.id);
  }
}
