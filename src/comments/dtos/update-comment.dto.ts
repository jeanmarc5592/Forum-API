import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateCommentDTO {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  content?: string;
}
