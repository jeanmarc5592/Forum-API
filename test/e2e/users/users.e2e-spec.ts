import * as request from 'supertest';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { DbTestUtils } from '../utils/db.test-utils';
import { UsersModule } from '../../../src/users/users.module';
import { User } from '../../../src/users/entities/user.entity';
import { ModuleTestUtils } from '../utils/module.test-utils';

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  beforeAll(async () => {
    dataSource = await DbTestUtils.setupDatabase();

    app = await ModuleTestUtils.setupTestModule(dataSource, UsersModule, User);
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
