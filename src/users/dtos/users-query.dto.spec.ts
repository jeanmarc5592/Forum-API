import { validate } from 'class-validator';
import { UsersQueryDTO } from './users-query.dto';
import { plainToClass } from 'class-transformer';

describe('UsersQueryDTO', () => {
  let dto: UsersQueryDTO;

  beforeEach(() => {
    dto = new UsersQueryDTO();
  });

  it('should pass validation with valid data', async () => {
    dto.limit = 5;
    dto.page = 1;

    const errors = await validate(dto);

    expect(errors.length).toBe(0);
  });

  it('should fail validation with non-numeric page', async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    dto.page = 'abc';
    dto.limit = 10;

    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isNumber');
  });

  it('should fail validation with non-numeric limit', async () => {
    dto.page = 1;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    dto.limit = 'xyz';

    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isNumber');
  });

  it('should transform the string values into number values', () => {
    const data = {
      page: '1',
      limit: '5',
    };

    const dto = plainToClass(UsersQueryDTO, data);

    expect(typeof dto.page).toBe('number');
    expect(typeof dto.limit).toBe('number');
  });
});
