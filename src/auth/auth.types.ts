export type JwtPayload = {
  sub: string;
  email?: string;
  name?: string;
  role?: Roles;
};

export enum Roles {
  ADMIN = 'admin',
  MODERATOR = 'moderator',
  USER = 'user',
}

export type RequestUser = {
  id: string;
  email?: string;
  name?: string;
  role?: Roles;
};

export enum Tokens {
  ACCESS_TOKEN = 'accessToken',
  REFRESH_TOKEN = 'refreshToken',
}

export type TokensMap = {
  [K in Tokens]: string;
};
