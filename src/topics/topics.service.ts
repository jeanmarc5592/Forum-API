import { Injectable } from '@nestjs/common';
import { CreateTopicDTO } from './dtos/create-topic.dto';
import { UpdateTopicDTO } from './dtos/update-topic.dto';

@Injectable()
export class TopicsService {
  async getAll() {
    return 'GET ALL';
  }

  async getById(id: string) {
    return 'GET BY ID ' + id;
  }

  async update(topicDTO: UpdateTopicDTO, id: string) {
    return 'UPDATE ' + id;
  }

  async delete(id: string) {
    return 'DELETE ' + id;
  }

  async create(topicDTO: CreateTopicDTO) {
    return 'CREATE';
  }
}
