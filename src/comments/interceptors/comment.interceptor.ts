import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { CommentsUtils } from '../comments.utils';
import { Comment } from '../entities/comment.entity';

@Injectable()
export class CommentInterceptor implements NestInterceptor {
  constructor(private readonly commentsUtils: CommentsUtils) {}

  intercept(
    _context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    return next
      .handle()
      .pipe(map((comment: Comment) => this.commentsUtils.transform(comment)));
  }
}
