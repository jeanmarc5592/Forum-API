import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Comment } from '@/comments/entities/comment.entity';
import { SubCategoriesService } from '@categories/sub-categories/sub-categories.service';
import { UsersService } from '@users/users.service';

import { CreateTopicDTO } from './dtos/create-topic.dto';
import { UpdateTopicDTO } from './dtos/update-topic.dto';
import { Topic } from './entities/topic.entity';

@Injectable()
export class TopicsService {
  constructor(
    @InjectRepository(Topic)
    private readonly topicsRepository: Repository<Topic>,
    @InjectRepository(Comment)
    private readonly commentsRepository: Repository<Comment>,
    private readonly subCategoriesService: SubCategoriesService,
    private readonly usersService: UsersService,
  ) {}

  async getAll(limit: number, page: number) {
    const skip = (page - 1) * limit;

    return await this.topicsRepository
      .createQueryBuilder('topic')
      .leftJoinAndSelect('topic.subCategory', 'subCategory')
      .leftJoinAndSelect('topic.user', 'user')
      .skip(skip)
      .limit(limit)
      .getMany();
  }

  async getById(id: string) {
    const topic = await this.topicsRepository
      .createQueryBuilder('topic')
      .leftJoinAndSelect('topic.subCategory', 'subCategory')
      .leftJoinAndSelect('topic.user', 'user')
      .where('topic.id = :id', { id })
      .getOne();

    if (!topic) {
      throw new NotFoundException(`Topic with id '${id}' not found.`);
    }

    return topic;
  }

  async getComments(id: string, limit: number, page: number) {
    const skip = (page - 1) * limit;

    const comments = await this.commentsRepository
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.topic', 'topic')
      .leftJoinAndSelect('comment.user', 'user')
      .where('topic.id = :id', { id })
      .orderBy('comment.created_at', 'DESC')
      .skip(skip)
      .take(limit)
      .getMany();

    if (!comments) {
      throw new NotFoundException(
        `Comments for topic with id '${id}' not found.`,
      );
    }

    return comments;
  }

  async update(topicDTO: UpdateTopicDTO, id: string) {
    const topic = await this.findTopicById(id);

    Object.assign(topic, topicDTO);

    return await this.topicsRepository.save(topic);
  }

  async delete(id: string) {
    const topic = await this.findTopicById(id);

    return await this.topicsRepository.remove(topic);
  }

  async create(topicDTO: CreateTopicDTO, userId: string) {
    const { subCategoryId, title, content } = topicDTO;

    const subCategory = await this.subCategoriesService.getById(subCategoryId);
    const user = await this.usersService.getById(userId);

    const newTopic = this.topicsRepository.create({
      title,
      content,
      subCategory,
      user,
    });

    return this.topicsRepository.save(newTopic);
  }

  private async findTopicById(id: string) {
    const topic = await this.topicsRepository.findOneBy({ id });

    if (!topic) {
      throw new NotFoundException(`Topic with id '${id}' not found.`);
    }

    return topic;
  }
}
