import { newDb } from 'pg-mem';
import { v4 as uuidv4 } from 'uuid';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env' });

export class DbTestUtils {
  static async setupDatabase() {
    const db = newDb();

    db.public.registerFunction({
      implementation: () => 'test',
      name: 'current_database',
    });

    db.public.registerFunction({
      name: 'version',
      implementation: () => 'Im not sure about PostgreSQL version',
    });

    db.public.registerFunction({
      name: 'uuid_generate_v4',
      implementation: () => uuidv4(),
    });

    const dataSource = await db.adapters.createTypeormDataSource({
      type: 'postgres',
      entities: [__dirname + '../../src/**/*.entity{.ts,.js}'],
      migrationsRun: false,
      migrationsTransactionMode: 'each',
      synchronize: false,
    });

    await dataSource.initialize();
    await dataSource.synchronize();

    return dataSource;
  }
}
