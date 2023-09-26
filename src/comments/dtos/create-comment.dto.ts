import { IsString, IsUUID } from 'class-validator';

export class CreateCommentDTO {
  @IsString()
  content: string;

  @IsUUID()
  topicId: string;
}
