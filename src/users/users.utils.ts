import { Injectable } from '@nestjs/common';

import { Comment } from '@/comments/entities/comment.entity';
import { Topic } from '@topics/entities/topic.entity';

import { User } from './entities/user.entity';

@Injectable()
export class UsersUtils {
  getTopics(user: User): Topic[] {
    return user.topics;
  }

  getComments(user: User): Comment[] {
    return user.comments;
  }
}
