import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Length,
} from 'class-validator';

export class UpdateTopicDTO {
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @Length(3, 50)
  title?: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  content?: string;

  @IsUUID()
  @IsOptional()
  @IsNotEmpty()
  subCategoryId?: string;

  @IsBoolean()
  @IsOptional()
  @IsNotEmpty()
  closed?: boolean;
}
