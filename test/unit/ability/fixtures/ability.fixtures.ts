import { Provider } from '@nestjs/common';

import { AbilityService } from '@/ability/ability.service';

export const MockAbilityService: Provider = {
  provide: AbilityService,
  useValue: {
    canUpdate: jest.fn(),
    canDelete: jest.fn(),
    canCreate: jest.fn(),
  },
};
