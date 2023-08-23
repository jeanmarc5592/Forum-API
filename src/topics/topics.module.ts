import { Module } from '@nestjs/common';
import { TopicsController } from './topics.controller';
import { TopicsService } from './topics.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Topic } from './entities/topic.entity';
import { SubCategoriesModule } from '@categories/sub-categories/sub-categories.module';
import { UsersModule } from '@users/users.module';
import { AbilityModule } from '@ability/ability.module';
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
