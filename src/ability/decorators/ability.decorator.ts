import { SetMetadata } from '@nestjs/common';
import { RequiredRule } from '../ability.types';

export const CHECK_ABILITY = 'check_ability';

export const CheckAbilities = (...requirements: RequiredRule[]) => {
  return SetMetadata(CHECK_ABILITY, requirements);
};
