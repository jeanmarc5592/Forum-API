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
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDTO } from './dtos/update-user.dto';
import { UsersQueryDTO } from './dtos/users-query.dto';
import { AccessTokenGuard } from 'src/auth/guards/access-token.guard';

@UseGuards(AccessTokenGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

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
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDTO) {
    return this.usersService.updateUser(body, id);
  }

  @Delete('/:id')
  deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }
}
