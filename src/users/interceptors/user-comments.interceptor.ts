import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { User } from '../entities/user.entity';
import { UsersUtils } from '../users.utils';

@Injectable()
export class UserCommentsInterceptor implements NestInterceptor {
  constructor(private readonly usersUtils: UsersUtils) {}

  intercept(
    _context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    return next
      .handle()
      .pipe(map((user: User) => this.usersUtils.getComments(user)));
  }
}
