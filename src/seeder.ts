import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { seeder } from 'nestjs-seeder';

import configuration from './config/configuration';
import { User } from './users/entities/user.entity';
import { UsersSeeder } from './users/users.seeder';
import { CryptographyUtils } from './utils/cryptography.utils';

seeder({
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
          host: '127.0.0.1',
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
    TypeOrmModule.forFeature([User]),
  ],
  providers: [CryptographyUtils],
}).run([UsersSeeder]);
