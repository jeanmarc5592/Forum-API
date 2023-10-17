import { Provider } from '@nestjs/common';

import { HttpUtils } from '@/utils/http.utils';

export const MockHttpUtils: Provider = {
  provide: HttpUtils,
  useValue: {
    checkIfParamIsUuid: jest.fn(),
    extractCookieFromRequest: jest.fn(),
  },
};
