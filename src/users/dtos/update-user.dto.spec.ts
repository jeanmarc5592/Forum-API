import { validate } from 'class-validator';
import { UpdateUserDTO } from './update-user.dto';

describe('UpdateUserDTO', () => {
  let dto: UpdateUserDTO;

  beforeEach(() => {
    dto = new UpdateUserDTO();
  });

  it('should pass validation with valid data', async () => {
    dto.name = 'John Doe';
    dto.age = '25';
    dto.email = 'test@example.com';
    dto.password = 'password123';
    dto.bio = 'Some bio information';
    dto.refreshToken = null;

    const errors = await validate(dto);

    expect(errors.length).toBe(0);
  });

  it('should fail validation with invalid name', async () => {
    dto.name = 'J';
    dto.age = '25';
    dto.email = 'test@example.com';
    dto.password = 'password123';

    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isLength');
  });

  it('should fail validation with invalid age', async () => {
    dto.name = 'John Doe';
    dto.age = 'twenty-five';
    dto.email = 'test@example.com';
    dto.password = 'password123';

    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isNumberString');
  });

  it('should fail validation with invalid email', async () => {
    dto.name = 'John Doe';
    dto.age = '25';
    dto.email = 'invalid_email';
    dto.password = 'password123';

    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isEmail');
  });

  it('should fail validation with invalid password', async () => {
    dto.name = 'John Doe';
    dto.age = '25';
    dto.email = 'test@example.com';
    dto.password = '123';

    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isLength');
  });

  it('should pass validation with optional fields', async () => {
    const errors = await validate(dto);

    expect(errors.length).toBe(0);
  });
});
