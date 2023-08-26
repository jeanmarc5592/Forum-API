import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

import { repositoryMockFactory } from '../../../src/app.types';

export class ModuleTestUtils {
  static async setupTestModule(
    dataSource: DataSource,
    module: any,
    entity: any,
  ) {
    const testModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [() => ({ jwt: { access: { secret: 'your-secret' } } })],
        }),
        module,
      ],
      providers: [
        {
          provide: getRepositoryToken(entity),
          useFactory: repositoryMockFactory,
        },
      ],
    })
      .overrideProvider(getRepositoryToken(entity))
      .useValue(dataSource)
      .compile();

    return testModule.createNestApplication();
  }
}
