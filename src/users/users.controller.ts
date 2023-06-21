import { Controller, Get, Post, Delete, Patch } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/:id')
  getUserById() {
    return 'GET USER';
  }

  @Patch('/:id')
  updateUser() {
    return 'UPDATE USER';
  }

  @Delete('/:id')
  deleteUser() {
    return 'DELETE USER';
  }

  @Post()
  createUser() {
    return 'CREATE USER';
  }
}
