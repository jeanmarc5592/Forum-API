import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

import { repositoryMockFactory } from '../../test.types';

export class ModuleTestUtils {
  static async setupTestModule(
    dataSource: DataSource,
    module: any,
    entities: any[],
  ) {
    const entityProviders = entities.map((entity) => ({
      provide: getRepositoryToken(entity),
      useFactory: repositoryMockFactory,
    }));

    let testModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [() => ({ jwt: { access: { secret: 'your-secret' } } })],
        }),
        module,
      ],
      providers: [
        ...entityProviders,
        {
          provide: DataSource,
          useValue: dataSource,
        },
      ],
    });

    for (const entity of entities) {
      testModule = testModule
        .overrideProvider(getRepositoryToken(entity))
        .useValue(dataSource);
    }

    return testModule.compile();
  }
}
