import { IsOptional, IsString } from 'class-validator';

export class UpdateCommentDTO {
  @IsString()
  @IsOptional()
  content?: string;
}
