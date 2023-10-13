import { Injectable } from '@nestjs/common';

import { TransformedComment } from '@/comments/comments.types';
import { Comment } from '@/comments/entities/comment.entity';
import { Topic } from '@topics/entities/topic.entity';

import { User } from './entities/user.entity';

@Injectable()
export class UsersUtils {
  getTopics(user: User): Topic[] {
    return user.topics;
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
