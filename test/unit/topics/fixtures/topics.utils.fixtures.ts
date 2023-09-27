import { Provider } from '@nestjs/common';

import { TopicsUtils } from '@topics/topics.utils';

export const MockTopicsUtils: Provider = {
  provide: TopicsUtils,
  useValue: {
    transformTopic: jest.fn(),
    getComments: jest.fn(),
  },
};
