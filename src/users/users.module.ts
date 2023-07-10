import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AccessTokenStrategy } from 'src/auth/strategies/access-token.strategy';
import { CryptographyUtils } from 'src/utils/cryptography.utils';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService, AccessTokenStrategy, CryptographyUtils],
  exports: [UsersService],
})
export class UsersModule {}
