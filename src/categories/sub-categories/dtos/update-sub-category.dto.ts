import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsOptional,
  IsArray,
  ValidateNested,
  Validate,
} from 'class-validator';

import { Roles } from '@auth/auth.types';
import { User } from '@users/entities/user.entity';

const AreAllModerators = () => {
  return function (object: object, propertyName: string) {
    Validate(
      (value: User[]) => {
        value.forEach((user) => {
          if (!user || user.role !== Roles.MODERATOR) {
            return false;
          }
        });

        return true;
      },
      {
        message: 'All users should have the role of "Moderator"',
      },
    )(object, propertyName);
  };
};

export class UpdateSubCategoryDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  description?: string;

  @IsUUID(4)
  @IsNotEmpty()
  @IsOptional()
  mainCategoryId?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @IsOptional()
  moderators?: string[];
}
