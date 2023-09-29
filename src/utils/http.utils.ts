import { BadRequestException, Injectable } from '@nestjs/common';
import { validate } from 'uuid';

@Injectable()
export class HttpUtils {
  checkIfParamIsUuid(param: { name: string; value: string }) {
    const isValid = validate(param.value);

    if (!isValid) {
      throw new BadRequestException(
        `Parameter '${param.name}' is not a valid UUID.`,
      );
    }

    return;
  }
}
