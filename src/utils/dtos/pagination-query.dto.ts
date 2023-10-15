import { Transform } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class PaginationQueryDTO {
  @IsNumber()
  @Transform((obj) => parseInt(obj.value))
  page: number;

  @IsNumber()
  @Transform((obj) => parseInt(obj.value))
  limit: number;
}
