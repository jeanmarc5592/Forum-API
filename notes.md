# Creating users in e2e tests

To accomplish the scenario where you need to create admin users for E2E tests, you can follow these steps:

1. **Create a Seeder or Test Utility**: First, create a seeder or a test utility function that can be used to create users with different roles, including the admin role.

2. **Use Factories**: Consider using a factory library like `typeorm-seeding` or `typeorm-factories` to simplify the process of creating test data. These libraries help you generate test data with specific attributes easily.

3. **Seed Admin Users Before Tests**: In your E2E test setup, use the seeder or test utility function to create admin users before running the tests that require admin privileges.

4. **Use Different Test Groups**: You can organize your tests into different groups, and for tests that require admin users, you can run those specific test groups separately, ensuring that the admin users are created beforehand.

Here's a basic example of how you can achieve this:

1. Create a test utility function to create users with different roles:

```typescript
// test-utils.ts
import { getRepository } from 'typeorm';
import { User } from './entities/user.entity';

export async function createUserWithRole(role: string): Promise<User> {
  const userRepository = getRepository(User);
  const user = new User();
  user.username = 'testuser';
  user.password = 'testpassword';
  user.role = role;
  return userRepository.save(user);
}
```

2. In your E2E test file, import the test utility and use it to create admin users before running the tests:

```typescript
// users.e2e-spec.ts
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { createUserWithRole } from './test-utils';

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  let adminToken: string; // Use this token for authenticated requests as an admin

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Seed admin user before running the tests
    const adminUser = await createUserWithRole('admin');
    // Get the JWT token for the admin user to use for authenticated requests
    // (This will depend on how you handle authentication in your application)
    adminToken = 'your-admin-jwt-token';
  });

  it('should create a new user', async () => {
    // Your test code here...
  });

  it('should update a user role as an admin', async () => {
    // Use adminToken to perform authenticated requests with admin privileges
    // Your test code here...
  });

  // Other tests...
});
```

By using this approach, you can ensure that you have admin users available for your E2E tests, and you can separate the tests that require admin privileges from other tests that can run with regular user privileges. This way, you can have better control over the test data and test scenarios while maintaining isolation between different test cases.

--------------------------------------------------------------------------------

