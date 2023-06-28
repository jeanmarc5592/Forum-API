import {
  IsEmail,
  IsNumberString,
  IsString,
  Length,
  IsOptional,
} from 'class-validator';

export class UpdateUserDTO {
  @IsString()
  @Length(3, 50)
  @IsOptional()
  name?: string;

  @IsNumberString()
  @IsOptional()
  age?: string;

  @IsString()
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @Length(8, 32)
  @IsOptional()
  password?: string;

  @IsString()
  @IsOptional()
  bio?: string;

  @IsString()
  @IsOptional()
  refreshToken?: string;
}
