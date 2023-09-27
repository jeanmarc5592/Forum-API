import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AbilityModule } from '@/ability/ability.module';
import { SubCategoriesModule } from '@/categories/sub-categories/sub-categories.module';
import { TopicsAbilityService } from '@/topics/topics.ability.service';
import { TopicsModule } from '@/topics/topics.module';
import { UsersModule } from '@/users/users.module';
import { HttpUtils } from '@/utils/http.utils';

import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { CommentsUtils } from './comments.utils';
import { Comment } from './entities/comment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Comment]),
    UsersModule,
    TopicsModule,
    AbilityModule,
    SubCategoriesModule,
  ],
  controllers: [CommentsController],
  providers: [CommentsService, HttpUtils, CommentsUtils, TopicsAbilityService],
})
export class CommentsModule {}
