import { IsString, IsUUID, Length } from 'class-validator';

export class CreateTopicDTO {
  @IsString()
  @Length(3, 50)
  title: string;

  @IsString()
  content: string;

  @IsUUID()
  subCategoryId: string;
}
