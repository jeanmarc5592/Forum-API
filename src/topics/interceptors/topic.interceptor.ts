import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Topic } from '../entities/topic.entity';
import { TopicsUtils } from '../topics.utils';

@Injectable()
export class TopicInterceptor implements NestInterceptor {
  constructor(private readonly topicsUtils: TopicsUtils) {}

  intercept(
    _context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    return next
      .handle()
      .pipe(map((topic: Topic) => this.topicsUtils.transform(topic)));
  }
}
