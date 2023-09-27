import { Provider } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';

import { repositoryMockFactory } from '@/app.types';
import { CommentsService } from '@/comments/comments.service';
import { Comment } from '@/comments/entities/comment.entity';

export const MockCommentsService: Provider = {
  provide: CommentsService,
  useValue: {
    getById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    create: jest.fn(),
  },
};

export const MockCommentsRespository: Provider = {
  provide: getRepositoryToken(Comment),
  useFactory: repositoryMockFactory,
};

export const mockComment = {
  id: '1',
  content: 'This is a comment',
  topic: {
    id: '1',
    title: 'Topic',
  },
  user: {
    id: '1',
    name: 'User',
  },
} as Comment;
