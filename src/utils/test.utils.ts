import { UpdateUserDTO } from 'src/users/dtos/update-user.dto';
import { User } from 'src/users/entities/users.entity';
import { UsersService } from '../users/users.service';
import { AuthService } from 'src/auth/auth.service';

export class TestUtils {
  static mockUsersService: Partial<UsersService> = {
    getUsers: () => {
      return Promise.resolve([
        { id: '1', name: 'User 1' },
        { id: '2', name: 'User 2' },
        { id: '3', name: 'User 3' },
      ] as User[]);
    },
    getUserById: (id: string) => {
      return Promise.resolve({
        id,
        name: `User ${id}`,
      } as User);
    },
    updateUser: (userDTO: UpdateUserDTO, id: string) => {
      return Promise.resolve({
        id,
        ...userDTO,
      } as User);
    },
    deleteUser: (id: string) => {
      return Promise.resolve({
        id,
        name: `User ${id}`,
      } as User);
    },
  };

  static mockAuthService: Partial<AuthService> = {
    signin: () => {
      return Promise.resolve({
        accessToken: 'Access_Token',
        refreshToken: 'Refresh_Token',
      });
    },
    signup: () => {
      return Promise.resolve({
        accessToken: 'Access_Token',
        refreshToken: 'Refresh_Token',
      });
    },
    refresh: () => {
      return Promise.resolve({
        accessToken: 'Access_Token',
        refreshToken: 'Refresh_Token',
      });
    },
    signout: () => {
      return Promise.resolve('OK');
    },
    validateUser: () => {
      return Promise.resolve({
        id: '1',
        name: 'User 1',
      } as User);
    },
  };
}
