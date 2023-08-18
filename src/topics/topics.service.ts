import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTopicDTO } from './dtos/create-topic.dto';
import { UpdateTopicDTO } from './dtos/update-topic.dto';
import { Repository } from 'typeorm';
import { Topic } from './entities/topic.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { SubCategoriesService } from 'src/categories/sub-categories/sub-categories.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class TopicsService {
  constructor(
    @InjectRepository(Topic)
    private readonly topicsRepository: Repository<Topic>,
    private readonly subCategoriesService: SubCategoriesService,
    private readonly usersService: UsersService,
  ) {}

  async getAll(limit: number, page: number) {
    const skip = (page - 1) * limit;
    const take = limit;

    // TODO: Add userId and subcategoryId to response

    return this.topicsRepository.find({ skip, take });
  }

  async getById(id: string) {
    // TODO: Add userId and subcategoryId to response

    return await this.findTopicById(id);
  }

  async update(topicDTO: UpdateTopicDTO, id: string) {
    return 'UPDATE ' + id;
  }

  async delete(id: string) {
    const topic = await this.findTopicById(id);

    return await this.topicsRepository.remove(topic);
  }

  async create(topicDTO: CreateTopicDTO) {
    const { subCategoryId, userId, title, content } = topicDTO;

    const subCategory = await this.subCategoriesService.getById(subCategoryId);
    const user = await this.usersService.getById(userId);

    const newTopic = this.topicsRepository.create({
      title,
      content,
      subCategory,
      user,
    });

    // TODO: Do not return all user and subcategory information

    return this.topicsRepository.save(newTopic);
  }

  private async findTopicById(id: string) {
    const user = await this.topicsRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(`Topic with id '${id}' not found.`);
    }

    return user;
  }
}
