import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Topic } from '@topics/entities/topic.entity';

import { User } from '../entities/user.entity';
import { UsersUtils } from '../users.utils';

@Injectable()
export class UserTopicsInterceptor implements NestInterceptor {
  constructor(private readonly userUtils: UsersUtils) {}

  intercept(
    _context: ExecutionContext,
    next: CallHandler<User>,
  ): Observable<Topic[]> {
    return next.handle().pipe(map((user) => this.userUtils.getTopics(user)));
  }
}
