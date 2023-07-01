import { validate } from 'class-validator';
import { LoginDTO } from './login.dto';

describe('LoginDTO', () => {
  let dto: LoginDTO;

  beforeEach(() => {
    dto = new LoginDTO();
  });

  it('should pass validation with valid email and password', async () => {
    dto.email = 'test@example.com';
    dto.password = 'password123';

    const errors = await validate(dto);

    expect(errors.length).toBe(0);
  });

  it('should fail validation with invalid email', async () => {
    dto.email = 'invalid_email';
    dto.password = 'password123';

    const errors = await validate(dto);

    expect(errors.length).toBe(1);
    expect(errors[0].constraints).toHaveProperty('isEmail');
  });

  it('should fail validation with empty email', async () => {
    dto.email = '';
    dto.password = 'password123';

    const errors = await validate(dto);

    expect(errors.length).toBe(1);
    expect(errors[0].constraints).toHaveProperty('isNotEmpty');
  });

  it('should fail validation with empty password', async () => {
    dto.email = 'test@example.com';
    dto.password = '';

    const errors = await validate(dto);

    expect(errors.length).toBe(1);
    expect(errors[0].constraints).toHaveProperty('isNotEmpty');
  });
});
