import { Injectable } from '@nestjs/common';

import { TransformedComment } from './comments.types';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentsUtils {
  transform(comment: Comment): TransformedComment {
    return {
      id: comment.id,
      content: comment.content,
      user: {
        id: comment.user.id,
        name: comment.user.name,
      },
      created_at: comment.created_at,
      updated_at: comment.updated_at,
    };
  }
}
