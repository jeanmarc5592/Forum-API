import { Provider } from '@nestjs/common';

import { UsersUtils } from '@users/users.utils';

export const MockUsersUtils: Provider = {
  provide: UsersUtils,
  useValue: {
    getTopics: jest.fn(),
  },
};
