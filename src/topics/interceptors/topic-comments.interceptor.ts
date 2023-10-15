import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Comment } from '@/comments/entities/comment.entity';

import { TopicsUtils } from '../topics.utils';

@Injectable()
export class TopicCommentsInterceptor implements NestInterceptor {
  constructor(private readonly topicsUtils: TopicsUtils) {}

  intercept(
    _context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    return next
      .handle()
      .pipe(
        map((comments: Comment[]) =>
          this.topicsUtils.transformComments(comments),
        ),
      );
  }
}
