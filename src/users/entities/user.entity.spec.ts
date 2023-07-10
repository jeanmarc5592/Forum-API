import { User } from './user.entity';

describe('User Entity', () => {
  it('should create an instance of User entity', () => {
    const user = new User();

    expect(user).toBeInstanceOf(User);
  });

  describe('properties', () => {
    it('should have the id property', () => {
      const user = new User();

      expect(user.id).toBeUndefined();

      user.id = '123';

      expect(user.id).toBe('123');
    });

    it('should have the name property', () => {
      const user = new User();

      user.name = 'John Doe';

      expect(user.name).toBe('John Doe');
    });

    it('should have the age property', () => {
      const user = new User();

      user.age = '25';

      expect(user.age).toBe('25');
    });

    it('should have the email property', () => {
      const user = new User();

      user.email = 'john@example.com';

      expect(user.email).toBe('john@example.com');
    });

    it('should have the password property', () => {
      const user = new User();

      user.password = 'password';

      expect(user.password).toBe('password');
    });

    it('should have the bio property', () => {
      const user = new User();

      user.bio = 'Lorem ipsum dolor sit amet.';

      expect(user.bio).toBe('Lorem ipsum dolor sit amet.');
    });

    it('should have the refreshToken property', () => {
      const user = new User();

      user.refreshToken = 'refresh_token';

      expect(user.refreshToken).toBe('refresh_token');
    });

    it('should have the created_at property', () => {
      const user = new User();

      expect(user.created_at).toBeUndefined();

      user.created_at = new Date();

      expect(user.created_at).toBeInstanceOf(Date);
    });

    it('should have the updated_at property', () => {
      const user = new User();

      user.updated_at = new Date();

      expect(user.updated_at).toBeInstanceOf(Date);
    });
  });

  it('should generate an uuid in the generateId method', () => {
    const user = new User();

    user.generateId();

    expect(user.id).toBeDefined();
    expect(user.id).toMatch(/^[0-9a-fA-F-]{36}$/);
  });
});
