export const UserRole = {
  guest: 'guest',
  owner: 'owner',
  admin: 'admin',
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];
