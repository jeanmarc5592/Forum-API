import { Provider } from '@nestjs/common';

import { CommentsUtils } from '@/comments/comments.utils';

export const MockCommentsUtils: Provider = {
  provide: CommentsUtils,
  useValue: {
    transform: jest.fn(),
  },
};
