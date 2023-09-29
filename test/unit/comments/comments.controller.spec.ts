import { Test, TestingModule } from '@nestjs/testing';

import { AbilityService } from '@/ability/ability.service';
import { Roles } from '@/auth/auth.types';
import { CommentsController } from '@/comments/comments.controller';
import { CommentsService } from '@/comments/comments.service';
import { CreateCommentDTO } from '@/comments/dtos/create-comment.dto';
import { UpdateCommentDTO } from '@/comments/dtos/update-comment.dto';
import { Comment } from '@/comments/entities/comment.entity';
import { TopicsAbilityService } from '@/topics/topics.ability.service';
import { TopicsService } from '@/topics/topics.service';
import { User } from '@/users/entities/user.entity';

import { MockCommentsService, mockComment } from './fixtures/comments.fixtures';
import { MockCommentsUtils } from './fixtures/comments.utils.fixtures';
import { MockAbilityService } from '../ability/fixtures/ability.fixtures';
import { mockRequestWithUser } from '../auth/fixtures/auth.fixtures';
import {
  MockTopicsAbilityService,
  MockTopicsService,
  mockTopic,
} from '../topics/fixtures/topics.fixtures';
import { MockHttpUtils } from '../utils/fixtures/http.utils.fixtures';

describe('CommentsController', () => {
  let controller: CommentsController;
  let commentsService: CommentsService;
  let abilityService: AbilityService;
  let topicsAbilityService: TopicsAbilityService;
  let topicsService: TopicsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentsController],
      providers: [
        MockCommentsService,
        MockCommentsUtils,
        MockHttpUtils,
        MockAbilityService,
        MockTopicsService,
        MockTopicsAbilityService,
      ],
    }).compile();

    controller = module.get<CommentsController>(CommentsController);
    commentsService = module.get<CommentsService>(CommentsService);
    abilityService = module.get<AbilityService>(AbilityService);
    topicsAbilityService =
      module.get<TopicsAbilityService>(TopicsAbilityService);
    topicsService = module.get<TopicsService>(TopicsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getById', () => {
    it('should return the comment with the provided id', async () => {
      jest.spyOn(commentsService, 'getById').mockResolvedValue(mockComment);

      const comment = await controller.getById(mockComment.id);

      expect(comment).toEqual(mockComment);
    });
  });

  describe('update', () => {
    it('should return the updated comment', async () => {
      const commentId = mockComment.id;
      const commentContent = 'Updated comment';
      const updates: UpdateCommentDTO = { content: commentContent };

      Object.assign(mockComment, updates);
      jest.spyOn(commentsService, 'update').mockResolvedValue(mockComment);

      const comment = await controller.update(
        commentId,
        updates,
        mockRequestWithUser,
      );

      expect(comment.id).toBe(commentId);
      expect(comment.content).toBe(commentContent);
    });

    it('should have called "canUpdate" of AbilityService correctly', async () => {
      const commentId = mockComment.id;
      const commentContent = 'Updated comment';
      const updates: UpdateCommentDTO = { content: commentContent };

      mockComment.user = mockRequestWithUser.user as User;

      Object.assign(mockComment, updates);
      jest.spyOn(commentsService, 'update').mockResolvedValue(mockComment);

      const canUpdate = jest.spyOn(abilityService, 'canUpdate');

      await controller.update(commentId, updates, mockRequestWithUser);

      expect(canUpdate).toHaveBeenCalledWith(
        mockRequestWithUser.user,
        updates,
        mockComment,
      );
    });

    it('should have called "canManage" of TopicsAbilityService correctly', async () => {
      const commentId = mockComment.id;
      const commentContent = 'Updated comment';
      const updates: UpdateCommentDTO = { content: commentContent };

      mockComment.user = {
        id: '1623625',
        name: 'User-XY',
        role: Roles.MODERATOR,
      } as User;

      mockTopic.comments = [mockComment];

      Object.assign(mockComment, updates);
      jest.spyOn(commentsService, 'update').mockResolvedValue(mockComment);
      jest.spyOn(topicsService, 'getById').mockResolvedValue(mockTopic);

      const canManage = jest.spyOn(topicsAbilityService, 'canManage');

      await controller.update(commentId, updates, mockRequestWithUser);

      expect(canManage).toHaveBeenCalledWith(
        mockRequestWithUser.user,
        mockTopic,
      );
    });
  });

  describe('delete', () => {
    it('should return the deleted comment', async () => {
      jest.spyOn(commentsService, 'delete').mockResolvedValue(mockComment);

      const comment = await controller.delete(
        mockComment.id,
        mockRequestWithUser,
      );

      expect(comment).toEqual(comment);
    });

    it('should have called "canDelete" of AbilityService correctly', async () => {
      const commentId = mockComment.id;

      mockComment.user = mockRequestWithUser.user as User;

      jest.spyOn(commentsService, 'getById').mockResolvedValue(mockComment);

      const canDelete = jest.spyOn(abilityService, 'canDelete');

      await controller.delete(commentId, mockRequestWithUser);

      expect(canDelete).toHaveBeenCalledWith(
        mockRequestWithUser.user,
        mockComment,
      );
    });

    it('should have called "canManage" of TopicsAbilityService correctly', async () => {
      const commentId = mockComment.id;

      mockComment.user = {
        id: '1623625',
        name: 'User-XY',
        role: Roles.MODERATOR,
      } as User;

      mockTopic.comments = [mockComment];

      jest.spyOn(commentsService, 'delete').mockResolvedValue(mockComment);
      jest.spyOn(topicsService, 'getById').mockResolvedValue(mockTopic);

      const canManage = jest.spyOn(topicsAbilityService, 'canManage');

      await controller.delete(commentId, mockRequestWithUser);

      expect(canManage).toHaveBeenCalledWith(
        mockRequestWithUser.user,
        mockTopic,
      );
    });
  });

  describe('create', () => {
    it('should return the created comment', async () => {
      const commentBody: CreateCommentDTO = {
        content: 'Some new Comment',
        topicId: 'Topic 123',
      };

      const newComment = {
        id: '123',
        content: commentBody.content,
        topic: {
          id: commentBody.topicId,
        },
      } as Comment;

      jest.spyOn(commentsService, 'create').mockResolvedValue(newComment);

      const comment = await controller.create(commentBody, mockRequestWithUser);

      expect(comment).toEqual(newComment);
    });
  });
});
