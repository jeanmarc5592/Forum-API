import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MainCategory } from '../entities/main-category.entity';
import { MainCategoriesUtils } from '../main-categories.utils';

@Injectable()
export class MainCategorySubCategoriesInterceptor implements NestInterceptor {
  constructor(private readonly mainCategoryUtils: MainCategoriesUtils) {}

  intercept(
    _context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    return next
      .handle()
      .pipe(
        map((mainCategory: MainCategory) =>
          this.mainCategoryUtils.transformWithSubCategories(mainCategory),
        ),
      );
  }
}
