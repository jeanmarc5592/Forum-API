import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  getUserById() {
    return 'USER';
  }

  updateUser() {
    return 'UPDATED USER';
  }

  deleteUser() {
    return 'DELETED USER';
  }

  createUser() {
    return 'CREATED USER';
  }
}
