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
export class SubCategoryCollectionInterceptor implements NestInterceptor {
  intercept(
    _context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    return next.handle().pipe(
      map((subCategories: SubCategory[]) =>
        subCategories.map((subCategory) => {
          return {
            id: subCategory.id,
            name: subCategory.name,
            description: subCategory.description,
            mainCategoryId: subCategory.mainCategory.id,
          };
        }),
      ),
    );
  }
}
