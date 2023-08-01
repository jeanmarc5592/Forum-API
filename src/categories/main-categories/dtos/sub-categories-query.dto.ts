import { IsOptional, IsUUID } from 'class-validator';

export class SubCategoriesQueryDTO {
  @IsUUID()
  @IsOptional()
  mainCategory?: string;
}
