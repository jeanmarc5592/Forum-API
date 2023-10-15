import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { DataSource } from 'typeorm';

import { Comment } from '@/comments/entities/comment.entity';
import { User } from '@users/entities/user.entity';
import { UsersModule } from '@users/users.module';

import { DbTestUtils } from '../test-utils/db.test-utils';
import { ModuleTestUtils } from '../test-utils/module.test-utils';

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  beforeAll(async () => {
    dataSource = await DbTestUtils.setupDatabase();

    const testModule = await ModuleTestUtils.setupTestModule(
      dataSource,
      UsersModule,
      [User, Comment],
    );
    app = testModule.createNestApplication();
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
