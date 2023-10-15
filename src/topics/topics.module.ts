import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CommentsUtils } from '@/comments/comments.utils';
import { Comment } from '@/comments/entities/comment.entity';
import { HttpUtils } from '@/utils/http.utils';
import { AbilityModule } from '@ability/ability.module';
import { SubCategoriesModule } from '@categories/sub-categories/sub-categories.module';
import { UsersModule } from '@users/users.module';

import { Topic } from './entities/topic.entity';
import { TopicsAbilityService } from './topics.ability.service';
import { TopicsController } from './topics.controller';
import { TopicsService } from './topics.service';
import { TopicsUtils } from './topics.utils';

@Module({
  imports: [
    TypeOrmModule.forFeature([Topic, Comment]),
    SubCategoriesModule,
    UsersModule,
    AbilityModule,
    SubCategoriesModule,
  ],
  controllers: [TopicsController],
  providers: [
    TopicsService,
    TopicsUtils,
    TopicsAbilityService,
    CommentsUtils,
    HttpUtils,
  ],
  exports: [TopicsService],
})
export class TopicsModule {}
