import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Comment } from '@/comments/entities/comment.entity';

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
      .pipe(
        map((comments: Comment[]) =>
          this.usersUtils.transformComments(comments),
        ),
      );
  }
}
