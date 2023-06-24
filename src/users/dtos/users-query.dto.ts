import { Transform } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class UsersQueryDTO {
  @IsNumber()
  @Transform((obj) => parseInt(obj.value))
  page: number;

  @IsNumber()
  @Transform((obj) => parseInt(obj.value))
  limit: number;
}
