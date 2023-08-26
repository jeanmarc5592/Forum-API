import { Injectable } from '@nestjs/common';

import { Topic } from '@topics/entities/topic.entity';

import { User } from './entities/user.entity';

@Injectable()
export class UsersUtils {
  getTopics(user: User): Topic[] {
    return user.topics;
  }
}
