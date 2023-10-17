import { BadRequestException, ExecutionContext } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { HttpUtils } from '@/utils/http.utils';
import { ParamUUIDInterceptor } from '@/utils/interceptors/param.uuid.interceptor';

describe('ParamUUIDInterceptor', () => {
  let interceptor: ParamUUIDInterceptor;
  let httpUtils: HttpUtils;

  beforeEach(async () => {
    httpUtils = {
      checkIfParamIsUuid: jest.fn(),
      extractCookieFromRequest: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ParamUUIDInterceptor,
        {
          provide: HttpUtils,
          useValue: httpUtils,
        },
      ],
    }).compile();

    interceptor = module.get<ParamUUIDInterceptor>(ParamUUIDInterceptor);
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  it('should call checkIfParamIsUuid with the correct parameters', () => {
    const mockRequestParams = {
      id: 'valid-uuid',
    };

    const context = {
      switchToHttp: () => ({
        getRequest: () => ({
          params: mockRequestParams,
        }),
      }),
    } as ExecutionContext;

    interceptor.intercept(context, { handle: jest.fn() });

    expect(httpUtils.checkIfParamIsUuid).toHaveBeenCalledWith({
      name: 'id',
      value: 'valid-uuid',
    });
  });

  it('should throw a BadRequestException if id param is missing', () => {
    const mockRequestParams = {
      foo: 'bar',
    };

    const context = {
      switchToHttp: () => ({
        getRequest: () => ({
          params: mockRequestParams,
        }),
      }),
    } as ExecutionContext;

    expect(() => interceptor.intercept(context, { handle: jest.fn() })).toThrow(
      BadRequestException,
    );
  });
});
