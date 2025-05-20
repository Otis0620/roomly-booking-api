export interface IJwtManager {
  sign<T extends object>(payload: T, secret: string, options?: IJwtSignOptions): string;
  verify<T>(token: string, secret: string): T;
  decode<T = unknown>(token: string): T | null;
}

export interface IJwtSignOptions {
  expiresIn?: string | number;
  audience?: string;
  issuer?: string;
  subject?: string;
  [key: string]: unknown;
}
