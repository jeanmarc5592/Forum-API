import { Test, TestingModule } from '@nestjs/testing';
import { AbilityFactory } from '@ability/ability.factory';
import { AbilityService } from '@ability/ability.service';
import { RequestUser, Roles } from '@auth/auth.types';
import { ForbiddenException } from '@nestjs/common';

describe('AbilityService', () => {
  let service: AbilityService;
  let abilityFactory: AbilityFactory;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AbilityService,
        {
          provide: AbilityFactory,
          useFactory: () => ({
            defineAbility: jest.fn().mockReturnValue({
              can: jest.fn(),
            }),
          }),
        },
      ],
    }).compile();

    service = module.get<AbilityService>(AbilityService);
    abilityFactory = module.get<AbilityFactory>(AbilityFactory);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('canUpdate', () => {
    it('should throw ForbiddenExpection if user is not allowed to update', () => {
      const reqUser: RequestUser = { id: '1', role: Roles.USER };
      const reqBody = { age: 25, email: 'test@example.com' };
      const subjectToEdit = { id: 1, name: 'John Doe' };

      (abilityFactory.defineAbility(reqUser) as any).can.mockReturnValue(false);

      expect(() => service.canUpdate(reqUser, reqBody, subjectToEdit)).toThrow(
        ForbiddenException,
      );
    });

    it('should not throw ForbiddenExpection if user is allowed to update', () => {
      const reqUser: RequestUser = { id: '1', role: Roles.USER };
      const reqBody = { age: 25, email: 'test@example.com' };
      const subjectToEdit = { id: 1, name: 'John Doe' };

      (abilityFactory.defineAbility(reqUser) as any).can.mockReturnValue(true);

      expect(() =>
        service.canUpdate(reqUser, reqBody, subjectToEdit),
      ).not.toThrow(ForbiddenException);
    });
  });

  describe('canDelete', () => {
    it('should throw ForbiddenExpection if user is not allowed to delete', () => {
      const reqUser: RequestUser = { id: '1', role: Roles.USER };
      const subjectToDelete = { id: 1, name: 'John Doe' };

      (abilityFactory.defineAbility(reqUser) as any).can.mockReturnValue(false);

      expect(() => service.canDelete(reqUser, subjectToDelete)).toThrow(
        ForbiddenException,
      );
    });

    it('should not throw ForbiddenExpection if user is allowed to delete', () => {
      const reqUser: RequestUser = { id: '1', role: Roles.USER };
      const subjectToDelete = { id: 1, name: 'John Doe' };

      (abilityFactory.defineAbility(reqUser) as any).can.mockReturnValue(true);

      expect(() => service.canDelete(reqUser, subjectToDelete)).not.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('canCreate', () => {
    it('should throw ForbiddenException if user not allowed to create', () => {
      const reqUser: RequestUser = { id: '1', role: Roles.USER };
      const subjectToCreate = { name: 'John Doe' };

      (abilityFactory.defineAbility(reqUser) as any).can.mockReturnValue(false);

      expect(() => service.canCreate(reqUser, subjectToCreate)).toThrow(
        ForbiddenException,
      );
    });

    it('should not throw ForbiddenException if user allowed to create', () => {
      const reqUser: RequestUser = { id: '1', role: Roles.USER };
      const subjectToCreate = { name: 'John Doe' };

      (abilityFactory.defineAbility(reqUser) as any).can.mockReturnValue(true);

      expect(() => service.canCreate(reqUser, subjectToCreate)).not.toThrow(
        ForbiddenException,
      );
    });
  });
});
