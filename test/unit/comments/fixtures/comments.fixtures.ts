import { Provider } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';

import { CommentsService } from '@/comments/comments.service';
import { TransformedComment } from '@/comments/comments.types';
import { Comment } from '@/comments/entities/comment.entity';

import { repositoryMockFactory } from '../../../test.types';

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

export const mockTransformedComment = {
  id: mockComment.id,
  content: mockComment.content,
  user: {
    id: mockComment.user.id,
    name: mockComment.user.name,
  },
  topic: {
    id: mockComment.topic.id,
    title: mockComment.topic.title,
  },
  created_at: mockComment.created_at,
  updated_at: mockComment.updated_at,
} as TransformedComment;
