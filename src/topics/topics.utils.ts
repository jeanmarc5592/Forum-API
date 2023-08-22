import { Injectable } from '@nestjs/common';
import { Topic } from './entities/topic.entity';
import { TransformedTopic } from './topics.types';

@Injectable()
export class TopicsUtils {
  transform(topic: Topic): TransformedTopic {
    return {
      id: topic.id,
      title: topic.title,
      content: topic.content,
      userId: topic.user.id,
      subCategoryId: topic.subCategory.id,
      closed: topic.closed,
      created_at: topic.created_at,
      updated_at: topic.updated_at,
    };
  }
}
