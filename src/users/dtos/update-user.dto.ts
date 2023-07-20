import {
  IsEmail,
  IsNumberString,
  IsString,
  Length,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { Roles } from '../../auth/auth.types';

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

  @IsEnum(Roles)
  @IsOptional()
  role?: string | null;

  @IsString()
  @IsOptional()
  refreshToken?: string | null;
}
