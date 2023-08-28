import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { User } from '@users/entities/user.entity';

import { SubCategory } from '../entities/sub-category.entity';
import { SubCategoriesUtils } from '../sub-categories.utils';

@Injectable()
export class SubCategoryModeratorsInterceptor implements NestInterceptor {
  constructor(private readonly subCategoryUtils: SubCategoriesUtils) {}

  intercept(
    _context: ExecutionContext,
    next: CallHandler<SubCategory>,
  ): Observable<User[]> {
    return next
      .handle()
      .pipe(
        map((subCategory) => this.subCategoryUtils.getModerators(subCategory)),
      );
  }
}
