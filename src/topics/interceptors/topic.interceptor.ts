import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Topic } from '../entities/topic.entity';

@Injectable()
export class TopicInterceptor implements NestInterceptor {
  intercept(
    _context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    return next.handle().pipe(
      map((topic: Topic) => {
        return {
          id: topic.id,
          title: topic.title,
          content: topic.content,
          userId: topic.user.id,
          subCategoryId: topic.subCategory.id,
          closed: topic.closed,
          created_at: topic.created_at,
          updated_at: topic.updated_at,
        };
      }),
    );
  }
}
