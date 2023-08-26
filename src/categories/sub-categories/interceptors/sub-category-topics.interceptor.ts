import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Topic } from '@topics/entities/topic.entity';

import { SubCategory } from '../entities/sub-category.entity';
import { SubCategoriesUtils } from '../sub-categories.utils';

@Injectable()
export class SubCategoryTopicsInterceptor implements NestInterceptor {
  constructor(private readonly subCategoryUtils: SubCategoriesUtils) {}

  intercept(
    _context: ExecutionContext,
    next: CallHandler<SubCategory>,
  ): Observable<Topic[]> {
    return next
      .handle()
      .pipe(map((subCategory) => this.subCategoryUtils.getTopics(subCategory)));
  }
}
