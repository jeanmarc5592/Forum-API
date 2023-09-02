import { IsNotEmpty, IsUUID } from 'class-validator';

export class AddModeratorsDTO {
  @IsUUID()
  @IsNotEmpty()
  userId: string;
}
