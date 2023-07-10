export type JwtPayload = {
  sub: string;
  email?: string;
  name?: string;
  role?: string;
};

export enum Roles {
  ADMIN = 'admin',
  MODERATOR = 'moderator',
  USER = 'user',
}
