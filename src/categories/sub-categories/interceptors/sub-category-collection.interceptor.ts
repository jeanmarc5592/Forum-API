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
export class SubCategoryCollectionInterceptor implements NestInterceptor {
  constructor(private readonly subCategoryUtils: SubCategoriesUtils) {}

  intercept(
    _context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    return next
      .handle()
      .pipe(
        map((subCategories: SubCategory[]) =>
          subCategories.map((subCategory) =>
            this.subCategoryUtils.transform(subCategory),
          ),
        ),
      );
  }
}
