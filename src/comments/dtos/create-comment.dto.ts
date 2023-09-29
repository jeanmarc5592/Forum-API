import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateCommentDTO {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsUUID()
  topicId: string;
}
