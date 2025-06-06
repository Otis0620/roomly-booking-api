import { BcryptManager } from './BcryptManager';
import { ICryptoManager } from './ICryptoManager';
import { ICryptoProvider } from './ICryptoProvider';

describe('BcryptManager', () => {
  let bcryptManager: ICryptoManager;
  let cryptoProviderMock: jest.Mocked<ICryptoProvider>;

  beforeEach(() => {
    jest.clearAllMocks();

    cryptoProviderMock = {
      hash: jest.fn(),
      genSalt: jest.fn(),
      compare: jest.fn(),
    };

    bcryptManager = new BcryptManager(cryptoProviderMock);
  });

  describe('hash', () => {
    it('should call bcrypt.hash with correct arguments and return the hash', async () => {
      cryptoProviderMock.hash.mockResolvedValueOnce('mocked-hash');

      const result = await bcryptManager.hash('my-password', 10);

      expect(cryptoProviderMock.hash).toHaveBeenCalledWith('my-password', 10);
      expect(result).toBe('mocked-hash');
    });
  });

  describe('genSalt', () => {
    it('should call bcrypt.genSalt with correct rounds and return the salt', async () => {
      cryptoProviderMock.genSalt.mockResolvedValueOnce('mocked-salt');

      const result = await bcryptManager.genSalt(12);

      expect(cryptoProviderMock.genSalt).toHaveBeenCalledWith(12);
      expect(result).toBe('mocked-salt');
    });
  });

  describe('compare', () => {
    it('should call bcrypt.compare with correct arguments and return the comparison result', async () => {
      cryptoProviderMock.compare.mockResolvedValueOnce(true);

      const result = await bcryptManager.compare('mocked-data', 'mocked-encrypted-data');

      expect(cryptoProviderMock.compare).toHaveBeenCalledWith(
        'mocked-data',
        'mocked-encrypted-data',
      );
      expect(result).toBe(true);
    });
  });
});
