import { BcryptManager } from '@lib/crypto/BcryptManager';

describe('BcryptManager', () => {
  let bcryptManager: BcryptManager;

  beforeEach(() => {
    bcryptManager = new BcryptManager();
  });

  describe('hash', () => {
    it('should hash a password', async () => {
      const password = 'securepassword123';
      const saltRounds = 10;

      const hash = await bcryptManager.hash(password, saltRounds);

      expect(hash).toBeDefined();
      expect(hash).not.toBe(password);
      expect(hash.startsWith('$2b$')).toBe(true);
    });

    it('should generate different hashes for same password', async () => {
      const password = 'securepassword123';
      const saltRounds = 10;

      const hash1 = await bcryptManager.hash(password, saltRounds);
      const hash2 = await bcryptManager.hash(password, saltRounds);

      expect(hash1).not.toBe(hash2);
    });
  });

  describe('compare', () => {
    it('should return true for matching password', async () => {
      const password = 'securepassword123';
      const hash = await bcryptManager.hash(password, 10);

      const result = await bcryptManager.compare(password, hash);

      expect(result).toBe(true);
    });

    it('should return false for non-matching password', async () => {
      const password = 'securepassword123';
      const wrongPassword = 'wrongpassword';
      const hash = await bcryptManager.hash(password, 10);

      const result = await bcryptManager.compare(wrongPassword, hash);

      expect(result).toBe(false);
    });
  });
});
