import { MainCategory } from './main-category.entity';

describe('Main Category Entity', () => {
  it('should create an instance of Main Category Entity', () => {
    const mainCategory = new MainCategory();

    expect(mainCategory).toBeInstanceOf(MainCategory);
  });

  describe('properties', () => {
    it('should have the id property', () => {
      const mainCategory = new MainCategory();

      expect(mainCategory.id).toBeUndefined();

      mainCategory.id = '123';

      expect(mainCategory.id).toBe('123');
    });

    it('should have the name property', () => {
      const mainCategory = new MainCategory();

      expect(mainCategory.name).toBeUndefined();

      mainCategory.name = 'Main Category';

      expect(mainCategory.name).toBe('Main Category');
    });

    it('should have the description property', () => {
      const mainCategory = new MainCategory();

      expect(mainCategory.description).toBeUndefined();

      mainCategory.description = 'Foo Bar';

      expect(mainCategory.description).toBe('Foo Bar');
    });

    it('should have the created_at property', () => {
      const mainCategory = new MainCategory();

      expect(mainCategory.created_at).toBeUndefined();

      mainCategory.created_at = new Date();

      expect(mainCategory.created_at).toBeInstanceOf(Date);
    });

    it('should have the updated_at property', () => {
      const mainCategory = new MainCategory();

      expect(mainCategory.updated_at).toBeUndefined();

      mainCategory.updated_at = new Date();

      expect(mainCategory.updated_at).toBeInstanceOf(Date);
    });
  });

  it('should generate an uuid in the generateId method', () => {
    const mainCategory = new MainCategory();

    mainCategory.generateId();

    expect(mainCategory.id).toBeDefined();
    expect(mainCategory.id).toMatch(/^[0-9a-fA-F-]{36}$/);
  });
});
