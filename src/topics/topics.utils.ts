import { Injectable } from '@nestjs/common';

import { TransformedComment } from '@/comments/comments.types';
import { Comment } from '@/comments/entities/comment.entity';

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

  transformComments(comments: Comment[]): TransformedComment[] {
    return comments.map((comment) => {
      return {
        id: comment.id,
        content: comment.content,
        created_at: comment.created_at,
        updated_at: comment.updated_at,
        topic: {
          id: comment.topic.id,
          title: comment.topic.title,
        },
      };
    });
  }
}
