import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TopicsModule } from '@/topics/topics.module';
import { UsersModule } from '@/users/users.module';

import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { Comment } from './entities/comment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comment]), UsersModule, TopicsModule],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
