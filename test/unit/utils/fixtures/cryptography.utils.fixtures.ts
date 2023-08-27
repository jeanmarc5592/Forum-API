import { Provider } from '@nestjs/common';

import { CryptographyUtils } from '@utils/cryptography.utils';

export const MockCryptographyUtils: Provider = {
  provide: CryptographyUtils,
  useValue: {
    hash: jest.fn(),
    verify: jest.fn(),
  },
};
