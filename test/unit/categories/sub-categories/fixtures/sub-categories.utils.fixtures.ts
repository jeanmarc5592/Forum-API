import { Provider } from '@nestjs/common';

import { SubCategoriesUtils } from '@categories/sub-categories/sub-categories.utils';

export const MockSubCategoriesUtils: Provider = {
  provide: SubCategoriesUtils,
  useValue: {
    transform: jest.fn(),
    getTopics: jest.fn(),
  },
};
