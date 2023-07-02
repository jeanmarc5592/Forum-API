import * as argon2 from 'argon2';
import { CryptographyUtils } from './cryptography.utils';

describe('CryptographyUtils', () => {
  let cryptographyUtils: CryptographyUtils;

  beforeEach(() => {
    cryptographyUtils = new CryptographyUtils();
  });

  it('should create an instance of CryptographyUtils', () => {
    expect(cryptographyUtils).toBeInstanceOf(CryptographyUtils);
  });

  describe('hash', () => {
    const data = 'rawPassword';

    it('should return the hashed value', async () => {
      const hashedValue = 'hashedPassword';

      jest.spyOn(argon2, 'hash').mockResolvedValue(hashedValue);

      const result = await cryptographyUtils.hash(data);

      expect(result).toBe(hashedValue);
      expect(argon2.hash).toHaveBeenCalledWith(data, {
        saltLength: cryptographyUtils['SALT_LENGTH'],
      });
    });
  });

  describe('verify', () => {
    const hash = 'hashed_password';
    const data = 'password';

    it('return true if the hash matches the data', async () => {
      jest.spyOn(argon2, 'verify').mockResolvedValue(true);

      const result = await cryptographyUtils.verify(hash, data);

      expect(result).toBe(true);
      expect(argon2.verify).toHaveBeenLastCalledWith(hash, data);
    });

    it('should return false if the hash does not match the data', async () => {
      jest.spyOn(argon2, 'verify').mockResolvedValue(false);

      const result = await cryptographyUtils.verify(hash, data);

      expect(result).toBe(false);
      expect(argon2.verify).toHaveBeenLastCalledWith(hash, data);
    });
  });
});
