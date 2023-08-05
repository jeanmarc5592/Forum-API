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

# E2E Testing Strategy

The decision of whether to organize E2E tests by resource or by privilege depends on the specific requirements and complexity of your application. Both approaches have their advantages and may be suitable in different scenarios. Let's explore both options:

1. **Organizing by Resource**:

   - **Advantages**:
     - Tests are more focused on testing the behavior and functionality of specific resources or endpoints. This can lead to clearer and more maintainable test cases.
     - Easier to identify test coverage for each resource, making it simpler to ensure comprehensive testing.
     - Easier to write and understand test scenarios, as they are related to specific entities or functionalities.

   - **Considerations**:
     - Some tests may require different roles to be performed on the same resource (e.g., admin performing CRUD operations and users performing read-only operations). You'll need to handle different roles within the same resource tests.
     - If you have complex relationships between resources, ensuring comprehensive test coverage may be more challenging.

2. **Organizing by Privilege**:

   - **Advantages**:
     - Tests are organized based on the different roles and privileges in the system, allowing you to validate each role's permissions across various resources.
     - Easier to test the authorization and access control mechanisms of the application thoroughly.
     - You can have dedicated tests for role-specific features and permissions, leading to more specific and targeted testing.

   - **Considerations**:
     - Tests may overlap if the same role is tested for multiple resources. You'll need to ensure you're not duplicating test scenarios.
     - Handling complex authorization logic might require setting up additional test data and conditions.

**Suggested Approach**:

A combination of both approaches can be a good idea to achieve a comprehensive test suite:

1. **Organize Tests by Resource**: Write tests for each resource (e.g., users, products, etc.) that cover basic CRUD operations and resource-specific functionalities.

2. **Organize Tests by Privilege**: Write tests that focus on different roles and their specific permissions across multiple resources. For example, tests to check if admins can perform certain actions across all resources or if users have read-only access to specific endpoints.

3. **Use Common Test Utilities**: Use common test utilities or setup functions to create test data for different roles, such as creating users with specific roles, and reuse them across tests.

4. **Use Tags or Labels**: If your test runner supports it, consider using tags or labels to group tests by resource or privilege, making it easier to run specific subsets of tests.

By combining these approaches, you can achieve a well-structured and comprehensive test suite that covers both resource-specific functionalities and role-based access control. This ensures that your application is thoroughly tested for different user roles and functionalities.

--------------------------------------------------------------------------------
