import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { Topic } from '@topics/entities/topic.entity';

@Injectable()
export class UsersUtils {
  getTopics(user: User): Topic[] {
    return user.topics;
  }
}
