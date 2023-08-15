import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { DbTestUtils } from './utils/db.test-utils';
import { UsersModule } from '../src/users/users.module';
import { repositoryMockFactory } from '../src/app.types';
import { User } from '../src/users/entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  beforeAll(async () => {
    dataSource = await DbTestUtils.setupDatabase();
    const module = await Test.createTestingModule({
      imports: [UsersModule],
      providers: [
        {
          provide: getRepositoryToken(User),
          useFactory: repositoryMockFactory,
        },
      ],
    })
      .overrideProvider(getRepositoryToken(User))
      .useValue(dataSource)
      .compile();

    app = module.createNestApplication();

    await app.init();
  });

  afterAll(async () => {
    await dataSource.destroy();
    await app.close();
  });

  describe('/users (GET)', () => {
    it('should return an Unauthorized status code', async () => {
      const response = await request(app.getHttpServer()).get('/users');
      expect(response.statusCode).toBe(HttpStatus.UNAUTHORIZED);
    });
  });
});
