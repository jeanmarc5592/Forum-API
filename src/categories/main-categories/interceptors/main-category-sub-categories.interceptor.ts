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
import { SubCategory } from '@/categories/sub-categories/entities/sub-category.entity';

@Injectable()
export class MainCategorySubCategoriesInterceptor implements NestInterceptor {
  constructor(private readonly mainCategoryUtils: MainCategoriesUtils) {}

  intercept(
    _context: ExecutionContext,
    next: CallHandler<MainCategory>,
  ): Observable<SubCategory[]> {
    return next
      .handle()
      .pipe(
        map((mainCategory) =>
          this.mainCategoryUtils.transformWithSubCategories(mainCategory),
        ),
      );
  }
}
