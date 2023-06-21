import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';

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
          host: config.get<string>('PG_HOST'),
          port: config.get<string>('PG_PORT'),
          username: config.get<string>('PG_USER'),
          password: config.get<string>('PG_PASSWORD'),
          database: config.get<string>('PG_DB'),
          ssl: true,
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          migrations: ['migrations/*.js'],
          synchronize: true,
          migrationsRun: true,
        };
      },
    }),
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
