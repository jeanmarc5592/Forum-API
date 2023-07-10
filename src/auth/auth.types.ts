export type JwtPayload = {
  sub: string;
  email?: string;
  name?: string;
};

export enum Roles {
  ADMIN = 'admin',
  MODERATOR = 'moderator',
  USER = 'user',
}
