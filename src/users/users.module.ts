import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AccessTokenStrategy } from '@auth/strategies/access-token.strategy';
import { CryptographyUtils } from '@utils/cryptography.utils';
import { AbilityModule } from '@ability/ability.module';
import { ConfigModule } from '@nestjs/config';
import { UsersUtils } from './users.utils';

@Module({
  imports: [TypeOrmModule.forFeature([User]), AbilityModule, ConfigModule],
  controllers: [UsersController],
  providers: [UsersService, AccessTokenStrategy, CryptographyUtils, UsersUtils],
  exports: [UsersService],
})
export class UsersModule {}
