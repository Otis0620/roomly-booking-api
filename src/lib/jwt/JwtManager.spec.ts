import { JwtManager, JwtPayload } from '@lib/jwt/JwtManager';

describe('JwtManager', () => {
  let jwtManager: JwtManager;
  let secret: string;
  let expiresIn: string;

  beforeEach(() => {
    secret = 'test-secret-key-at-least-32-chars';
    expiresIn = '1h';

    jwtManager = new JwtManager(secret, expiresIn);
  });

  describe('sign', () => {
    it('should sign a payload and return a token', () => {
      const payload: JwtPayload = { sub: '123', role: 'guest' };

      const token = jwtManager.sign(payload);

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3);
    });

    it('should sign a payload with options', () => {
      const payload: JwtPayload = { sub: '123', role: 'guest' };

      const token = jwtManager.sign(payload);

      expect(token).toBeDefined();
    });
  });

  describe('verify', () => {
    it('should verify a valid token and return payload', () => {
      const payload: JwtPayload = { sub: '123', role: 'guest' };
      const token = jwtManager.sign(payload);

      const decoded = jwtManager.verify(token);

      expect(decoded.sub).toBe('123');
      expect(decoded.role).toBe('guest');
    });

    it('should throw error for invalid token', () => {
      const invalidToken = 'invalid.token.here';

      expect(() => jwtManager.verify(invalidToken)).toThrow();
    });

    it('should throw error for expired token', () => {
      const expiresIn = '-1s';

      const jwtManager = new JwtManager(secret, expiresIn);

      const payload: JwtPayload = { sub: '123', role: 'guest' };
      const token = jwtManager.sign(payload);

      expect(() => jwtManager.verify(token)).toThrow();
    });
  });

  describe('decode', () => {
    it('should decode a token without verification', () => {
      const payload: JwtPayload = { sub: '123', role: 'guest' };
      const token = jwtManager.sign(payload);

      const decoded = jwtManager.decode(token);

      expect(decoded?.sub).toBe('123');
      expect(decoded?.role).toBe('guest');
    });

    it('should return null for invalid token', () => {
      const decoded = jwtManager.decode('not-a-valid-token');

      expect(decoded).toBeNull();
    });

    it('should decode token even with wrong secret used for signing', () => {
      const payload: JwtPayload = { sub: '123', role: 'guest' };
      const token = jwtManager.sign(payload);

      const decoded = jwtManager.decode(token);

      expect(decoded?.sub).toBe('123');
    });
  });
});
