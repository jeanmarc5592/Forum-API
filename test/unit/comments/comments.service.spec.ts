import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CommentsService } from '@/comments/comments.service';
import { CreateCommentDTO } from '@/comments/dtos/create-comment.dto';
import { UpdateCommentDTO } from '@/comments/dtos/update-comment.dto';
import { Comment } from '@/comments/entities/comment.entity';

import {
  MockCommentsRespository,
  mockComment,
} from './fixtures/comments.fixtures';
import { MockType } from '../../test.types';
import { MockTopicsService } from '../topics/fixtures/topics.fixtures';
import { MockUsersService } from '../users/fixtures/users.fixtures';

describe('CommentsService', () => {
  let service: CommentsService;
  let repositoryMock: MockType<Repository<Comment>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentsService,
        MockTopicsService,
        MockUsersService,
        MockCommentsRespository,
      ],
    }).compile();

    service = module.get<CommentsService>(CommentsService);
    repositoryMock = module.get(getRepositoryToken(Comment));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getById', () => {
    it('should return a comment', async () => {
      repositoryMock.createQueryBuilder?.mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(mockComment),
      });

      const comment = await service.getById(mockComment.id);

      expect(comment).toEqual(mockComment);
    });

    it('should throw a NotFoundException if comment was not found', async () => {
      repositoryMock.createQueryBuilder?.mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null),
      });

      await expect(service.getById('123')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a comment', async () => {
      const updates: UpdateCommentDTO = {
        content: 'Updated comment',
      };

      repositoryMock.createQueryBuilder?.mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(mockComment),
      });
      repositoryMock.save?.mockReturnValue({ ...mockComment, ...updates });

      const comment = await service.update(updates, mockComment.id);

      expect(comment).toEqual(mockComment);
    });

    it('should throw a NotFoundException if comment was not found', async () => {
      const updates: UpdateCommentDTO = {
        content: 'Updated comment',
      };

      repositoryMock.createQueryBuilder?.mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null),
      });

      await expect(service.update(updates, '123')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('delete', () => {
    it('should delete a comment', async () => {
      repositoryMock.createQueryBuilder?.mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(mockComment),
      });
      repositoryMock.delete?.mockReturnValue(mockComment);

      const comment = await service.delete(mockComment.id);

      expect(comment).toEqual(mockComment);
    });

    it('should throw a NotFoundException if comment was not found', async () => {
      repositoryMock.createQueryBuilder?.mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null),
      });

      await expect(service.delete('123')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a comment', async () => {
      const newComment: CreateCommentDTO = {
        content: 'This is a new comment',
        topicId: 'Topic-123',
      };

      repositoryMock.create?.mockReturnValue(newComment);
      repositoryMock.save?.mockReturnValue(newComment);

      const comment = await service.create(newComment, '1');

      expect(comment).toEqual(newComment);
    });
  });
});
