import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SubCategory } from '../entities/sub-category.entity';

@Injectable()
export class SubCategoryTopicsInterceptor implements NestInterceptor {
  intercept(
    _context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    return next.handle().pipe(
      map((subCategory: SubCategory) => {
        return {
          id: subCategory.id,
          name: subCategory.name,
          description: subCategory.description,
          mainCategoryId: subCategory.mainCategory.id,
          topics: subCategory.topics,
        };
      }),
    );
  }
}
