import { JwtManager, JwtPayload } from '@lib/jwt/JwtManager';

describe('JwtManager', () => {
  let jwtManager: JwtManager;
  const secret = 'test-secret-key-at-least-32-chars';

  beforeEach(() => {
    jwtManager = new JwtManager();
  });

  describe('sign', () => {
    it('should sign a payload and return a token', () => {
      const payload: JwtPayload = { sub: '123', role: 'guest' };

      const token = jwtManager.sign(payload, secret);

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3);
    });

    it('should sign a payload with options', () => {
      const payload: JwtPayload = { sub: '123', role: 'guest' };

      const token = jwtManager.sign(payload, secret, { expiresIn: '1h' });

      expect(token).toBeDefined();
    });
  });

  describe('verify', () => {
    it('should verify a valid token and return payload', () => {
      const payload: JwtPayload = { sub: '123', role: 'guest' };
      const token = jwtManager.sign(payload, secret);

      const decoded = jwtManager.verify(token, secret);

      expect(decoded.sub).toBe('123');
      expect(decoded.role).toBe('guest');
    });

    it('should throw error for invalid token', () => {
      const invalidToken = 'invalid.token.here';

      expect(() => jwtManager.verify(invalidToken, secret)).toThrow();
    });

    it('should throw error for wrong secret', () => {
      const payload: JwtPayload = { sub: '123', role: 'guest' };
      const token = jwtManager.sign(payload, secret);

      expect(() => jwtManager.verify(token, 'wrong-secret')).toThrow();
    });

    it('should throw error for expired token', () => {
      const payload: JwtPayload = { sub: '123', role: 'guest' };
      const token = jwtManager.sign(payload, secret, { expiresIn: '-1s' });

      expect(() => jwtManager.verify(token, secret)).toThrow();
    });
  });

  describe('decode', () => {
    it('should decode a token without verification', () => {
      const payload: JwtPayload = { sub: '123', role: 'guest' };
      const token = jwtManager.sign(payload, secret);

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
      const token = jwtManager.sign(payload, 'different-secret-key-32-chars-long');

      const decoded = jwtManager.decode(token);

      expect(decoded?.sub).toBe('123');
    });
  });
});
