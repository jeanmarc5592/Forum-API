import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateMainCategoryDTO {
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  name?: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  description?: string;
}
