import { IJwtSignOptions } from './IJwtManager';
import { JwtManager } from './JwtManager';

describe('JwtManager', () => {
  const payload = { id: '123', role: 'user' };
  const secret = 'test-secret';
  const token = 'mocked.jwt.token';

  let jwtLibMock: {
    sign: jest.Mock;
    verify: jest.Mock;
    decode: jest.Mock;
  };

  let jwtManager: JwtManager;

  beforeEach(() => {
    jwtLibMock = {
      sign: jest.fn().mockReturnValue(token),
      verify: jest.fn().mockReturnValue(payload),
      decode: jest.fn().mockReturnValue(payload),
    };

    jwtManager = new JwtManager(jwtLibMock as any);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('sign', () => {
    it('should sign a token with given payload, secret and options', () => {
      const options: IJwtSignOptions = { expiresIn: '1h' };

      const result = jwtManager.sign(payload, secret, options);

      expect(jwtLibMock.sign).toHaveBeenCalledWith(payload, secret, options);
      expect(result).toBe(token);
    });

    it('should sign a token with default options if none are provided', () => {
      const result = jwtManager.sign(payload, secret);

      expect(jwtLibMock.sign).toHaveBeenCalledWith(payload, secret, undefined);
      expect(result).toBe(token);
    });
  });

  describe('verify', () => {
    it('should verify a token and return the decoded payload', () => {
      const result = jwtManager.verify<typeof payload>(token, secret);

      expect(jwtLibMock.verify).toHaveBeenCalledWith(token, secret);
      expect(result).toEqual(payload);
    });
  });

  describe('decode', () => {
    it('should decode a token and return the decoded value', () => {
      const result = jwtManager.decode<typeof payload>(token);

      expect(jwtLibMock.decode).toHaveBeenCalledWith(token);
      expect(result).toEqual(payload);
    });

    it('should return null if decoding fails or returns null', () => {
      jwtLibMock.decode.mockReturnValueOnce(null);

      const result = jwtManager.decode(token);

      expect(result).toBeNull();
    });
  });
});
