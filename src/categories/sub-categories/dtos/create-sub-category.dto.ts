import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateSubCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsUUID(4)
  @IsNotEmpty()
  mainCategoryId: string;
}
