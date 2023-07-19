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
import { UsersService } from './users.service';
import { UpdateUserDTO } from './dtos/update-user.dto';
import { UsersQueryDTO } from './dtos/users-query.dto';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { RequestUser } from 'src/auth/auth.types';
import { AbilityService } from 'src/ability/ability.service';

@UseGuards(AccessTokenGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly abilityService: AbilityService,
  ) {}

  @Get()
  getUsers(@Query() query: UsersQueryDTO) {
    const { limit, page } = query;

    return this.usersService.getUsers(limit, page);
  }

  @Get('/:id')
  getUserById(@Param('id') id: string) {
    return this.usersService.getUserById(id);
  }

  @Patch('/:id')
  async updateUser(
    @Param('id') id: string,
    @Body() body: UpdateUserDTO,
    @Req() req: { user: RequestUser },
  ) {
    const userToUpdate = await this.usersService.getUserById(id);
    this.abilityService.canUpdate(req.user, body, userToUpdate);

    return this.usersService.updateUser(body, id);
  }

  @Delete('/:id')
  async deleteUser(@Param('id') id: string, @Req() req: { user: RequestUser }) {
    const userToDelete = await this.usersService.getUserById(id);
    this.abilityService.canDelete(req.user, userToDelete);

    return this.usersService.deleteUser(id);
  }
}
