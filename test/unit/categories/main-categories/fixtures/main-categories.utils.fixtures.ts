import { Provider } from '@nestjs/common';

import { MainCategoriesUtils } from '@categories/main-categories/main-categories.utils';

export const MockMainCategoriesUtils: Provider = {
  provide: MainCategoriesUtils,
  useValue: {
    getSubCategories: jest.fn(),
  },
};
