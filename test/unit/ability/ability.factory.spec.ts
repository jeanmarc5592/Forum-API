import { AbilityFactory } from '../../../src/ability/ability.factory';
import { RequestUser, Roles } from '../../../src/auth/auth.types';

describe('AbilityFactory', () => {
  let abilityFactory: AbilityFactory;

  beforeEach(() => {
    abilityFactory = new AbilityFactory();
  });

  it('should create an instance of AbilityFactory', () => {
    expect(abilityFactory).toBeInstanceOf(AbilityFactory);
  });

  it('should define admin abilities', () => {
    const user = { role: Roles.ADMIN } as RequestUser;
    const defineAdminAbilitiesSpy = jest.spyOn(
      abilityFactory as any,
      'defineAdminAbilities',
    );

    const result = abilityFactory.defineAbility(user);

    expect(defineAdminAbilitiesSpy).toHaveBeenCalled();
    expect(result).toBeDefined();
  });

  it('should define moderator abilities', () => {
    const user = { role: Roles.MODERATOR } as RequestUser;
    const defineModeratorAbilitiesSpy = jest.spyOn(
      abilityFactory as any,
      'defineModeratorAbilities',
    );

    const result = abilityFactory.defineAbility(user);

    expect(defineModeratorAbilitiesSpy).toHaveBeenCalled();
    expect(result).toBeDefined();
  });

  it('should define user abilities', () => {
    const user = { role: Roles.USER } as RequestUser;
    const defineUserAbilitiesSpy = jest.spyOn(
      abilityFactory as any,
      'defineUserAbilities',
    );

    const result = abilityFactory.defineAbility(user);

    expect(defineUserAbilitiesSpy).toHaveBeenCalled();
    expect(result).toBeDefined();
  });
});
