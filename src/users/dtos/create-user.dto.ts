import {
  IsEmail,
  IsNumberString,
  IsString,
  Length,
  IsOptional,
} from 'class-validator';

export class CreateUserDTO {
  @IsString()
  @Length(3, 50)
  name: string;

  @IsNumberString()
  age: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @Length(8, 32)
  password: string;

  @IsString()
  @IsOptional()
  bio?: string;
}
