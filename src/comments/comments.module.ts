import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TopicsModule } from '@/topics/topics.module';
import { UsersModule } from '@/users/users.module';
import { HttpUtils } from '@/utils/http.utils';

import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { CommentsUtils } from './comments.utils';
import { Comment } from './entities/comment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comment]), UsersModule, TopicsModule],
  controllers: [CommentsController],
  providers: [CommentsService, HttpUtils, CommentsUtils],
})
export class CommentsModule {}
