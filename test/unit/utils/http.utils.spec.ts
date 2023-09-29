import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { HttpUtils } from '@/utils/http.utils';

describe('HttpUtils', () => {
  let httpUtils: HttpUtils;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HttpUtils],
    }).compile();

    httpUtils = module.get<HttpUtils>(HttpUtils);
  });

  it('should be defined', () => {
    expect(httpUtils).toBeDefined();
  });

  describe('checkIfParamIsUuid', () => {
    it('should not throw an exception if the value is a valid UUID', () => {
      const validParam = {
        name: 'id',
        value: '123e4567-e89b-12d3-a456-426614174001',
      };

      const spy = jest.spyOn(httpUtils, 'checkIfParamIsUuid');

      expect(() => httpUtils.checkIfParamIsUuid(validParam)).not.toThrow();
      expect(spy).toHaveReturned();
    });

    it('should throw BadRequestException if the value is not a valid UUID', () => {
      const invalidParam = { name: 'id', value: 'invalid-uuid' };

      const spy = jest.spyOn(httpUtils, 'checkIfParamIsUuid');

      expect(() => httpUtils.checkIfParamIsUuid(invalidParam)).toThrow(
        BadRequestException,
      );

      expect(spy).not.toHaveReturned();
    });

    it('should throw BadRequestException if the value is empty', () => {
      const emptyParam = { name: 'id', value: '' };

      expect(() => httpUtils.checkIfParamIsUuid(emptyParam)).toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException if the value is undefined', () => {
      const undefinedParam = { name: 'id', value: undefined };

      const spy = jest.spyOn(httpUtils, 'checkIfParamIsUuid');

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      expect(() => httpUtils.checkIfParamIsUuid(undefinedParam)).toThrow(
        BadRequestException,
      );

      expect(spy).not.toHaveReturned();
    });
  });
});
