import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMainCategoryDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}
