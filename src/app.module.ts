import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AbilityModule } from './ability/ability.module';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
import { CommentsModule } from './comments/comments.module';
import configuration from './config/configuration';
import { TopicsModule } from './topics/topics.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: config.get<any>('database.type'),
          host: config.get<string>('database.host'),
          port: config.get<string>('database.port'),
          username: config.get<string>('database.user'),
          password: config.get<string>('database.password'),
          database: config.get<string>('database.name'),
          ssl: process.env.NODE_EV === 'production ? true : false',
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          migrations: ['migrations/*.js'],
          synchronize: true,
          migrationsRun: true,
        };
      },
    }),
    UsersModule,
    AuthModule,
    AbilityModule,
    CategoriesModule,
    TopicsModule,
    CommentsModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({ whitelist: true }),
    },
  ],
})
export class AppModule {}
