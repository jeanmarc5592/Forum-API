import {
  Controller,
  Get,
  Delete,
  Patch,
  Param,
  Body,
  UseInterceptors,
  ClassSerializerInterceptor,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';

import { AbilityService } from '@ability/ability.service';
import { RequestUser } from '@auth/auth.types';
import { AccessTokenGuard } from '@auth/guards/access-token.guard';

import { UpdateUserDTO } from './dtos/update-user.dto';
import { UsersQueryDTO } from './dtos/users-query.dto';
import { UserTopicsInterceptor } from './interceptors/user-topics.interceptor';
import { UsersService } from './users.service';
@UseGuards(AccessTokenGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly abilityService: AbilityService,
  ) {}

  @Get()
  getAll(@Query() query: UsersQueryDTO) {
    const { limit, page } = query;

    return this.usersService.getAll(limit, page);
  }

  @Get('/:id')
  getById(@Param('id') id: string) {
    return this.usersService.getById(id);
  }

  @UseInterceptors(UserTopicsInterceptor)
  @Get('/:id/topics')
  getTopics(@Param('id') id: string) {
    return this.usersService.getTopics(id);
  }

  @Patch('/:id')
  async update(
    @Param('id') id: string,
    @Body() body: UpdateUserDTO,
    @Req() req: { user: RequestUser },
  ) {
    const userToUpdate = await this.usersService.getById(id);
    this.abilityService.canUpdate(req.user, body, userToUpdate);

    return this.usersService.update(body, id);
  }

  @Delete('/:id')
  async delete(@Param('id') id: string, @Req() req: { user: RequestUser }) {
    const userToDelete = await this.usersService.getById(id);
    this.abilityService.canDelete(req.user, userToDelete);

    return this.usersService.delete(id);
  }
}
