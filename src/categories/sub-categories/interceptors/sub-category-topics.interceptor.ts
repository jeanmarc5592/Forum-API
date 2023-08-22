import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SubCategory } from '../entities/sub-category.entity';
import { SubCategoriesUtils } from '../sub-categories.utils';

@Injectable()
export class SubCategoryTopicsInterceptor implements NestInterceptor {
  constructor(private readonly subCategoryUtils: SubCategoriesUtils) {}

  intercept(
    _context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    return next
      .handle()
      .pipe(
        map((subCategory: SubCategory) =>
          this.subCategoryUtils.transformWithTopics(subCategory),
        ),
      );
  }
}
