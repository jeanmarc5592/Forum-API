import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { APP_PIPE } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { AbilityModule } from './ability/ability.module';
import { CategoriesModule } from './categories/categories.module';
import { TopicsModule } from './topics/topics.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: config.get<any>('DB_TYPE'),
          host: config.get<string>('DB_HOST'),
          port: config.get<string>('DB_PORT'),
          username: config.get<string>('DB_USER'),
          password: config.get<string>('DB_PASSWORD'),
          database: config.get<string>('DB_NAME'),
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
