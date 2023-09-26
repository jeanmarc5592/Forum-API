import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';

import { HttpUtils } from '../http.utils';

@Injectable()
export class ParamUUIDInterceptor implements NestInterceptor {
  constructor(private readonly httpUtils: HttpUtils) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    const request: Request = context.switchToHttp().getRequest();

    if (!('id' in request.params)) {
      throw new BadRequestException("Parameter 'id' is missing.");
    }

    this.httpUtils.checkIfParamIsUuid({ name: 'id', value: request.params.id });

    return next.handle();
  }
}
