import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AbilityModule } from '@ability/ability.module';
import { SubCategoriesModule } from '@categories/sub-categories/sub-categories.module';
import { UsersModule } from '@users/users.module';

import { Topic } from './entities/topic.entity';
import { TopicsController } from './topics.controller';
import { TopicsService } from './topics.service';
import { TopicsUtils } from './topics.utils';

@Module({
  imports: [
    TypeOrmModule.forFeature([Topic]),
    SubCategoriesModule,
    UsersModule,
    AbilityModule,
  ],
  controllers: [TopicsController],
  providers: [TopicsService, TopicsUtils],
})
export class TopicsModule {}
