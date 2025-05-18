export interface ICryptoProvider {
  hash(data: string, saltRounds: number): Promise<string>;
  genSalt(rounds: number): Promise<string>;
  compare(data: string, encrypted: string): Promise<boolean>;
}
