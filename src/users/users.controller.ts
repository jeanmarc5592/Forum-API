import { Controller, Get, Post, Delete, Patch } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/:id')
  getUserById() {
    return this.usersService.getUserById();
  }

  @Patch('/:id')
  updateUser() {
    return this.usersService.updateUser();
  }

  @Delete('/:id')
  deleteUser() {
    return this.usersService.deleteUser();
  }

  @Post()
  createUser() {
    return this.usersService.createUser();
  }
}
