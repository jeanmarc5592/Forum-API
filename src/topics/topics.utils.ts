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
      user: {
        id: topic.user.id,
        name: topic.user.name,
      },
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
        user: {
          id: comment.user.id,
          name: comment.user.name,
        },
      };
    });
  }
}
