import { IsString, IsNotEmpty, IsUUID, IsOptional } from 'class-validator';

export class UpdateSubCategoryDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  description?: string;

  @IsUUID(4)
  @IsNotEmpty()
  @IsOptional()
  mainCategoryId?: string;
}
