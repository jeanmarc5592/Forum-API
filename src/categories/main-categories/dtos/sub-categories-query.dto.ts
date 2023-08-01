import { IsUUID } from 'class-validator';

export class SubCategoriesQueryDTO {
  @IsUUID()
  mainCategory: string;
}
