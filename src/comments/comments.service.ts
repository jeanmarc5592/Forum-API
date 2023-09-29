import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { TopicsService } from '@/topics/topics.service';
import { UsersService } from '@/users/users.service';

import { CreateCommentDTO } from './dtos/create-comment.dto';
import { UpdateCommentDTO } from './dtos/update-comment.dto';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentsRepository: Repository<Comment>,
    private readonly topicsService: TopicsService,
    private readonly usersService: UsersService,
  ) {}

  async getById(id: string) {
    const comment = await this.commentsRepository
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.user', 'user')
      .leftJoinAndSelect('comment.topic', 'topic')
      .where('comment.id = :id', { id })
      .getOne();

    if (!comment) {
      throw new NotFoundException(`Comment with id '${id}' not found.`);
    }

    return comment;
  }

  async update(commentDTO: UpdateCommentDTO, id: string) {
    const comment = await this.getById(id);

    Object.assign(comment, commentDTO);

    return await this.commentsRepository.save(comment);
  }

  async delete(id: string) {
    const comment = await this.getById(id);

    return await this.commentsRepository.remove(comment);
  }

  async create(commentDTO: CreateCommentDTO, userId: string) {
    const { content, topicId } = commentDTO;

    const topic = await this.topicsService.getById(topicId);
    const user = await this.usersService.getById(userId);

    const newComment = this.commentsRepository.create({
      content,
      topic,
      user,
    });

    return this.commentsRepository.save(newComment);
  }
}
