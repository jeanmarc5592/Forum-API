export default () => ({
  port: parseInt(process.env.PORT as string, 10) || 3000,
  database: {
    type: process.env.DB_TYPE || 'postgres',
    host: process.env.DB_HOST || 'db',
    port: parseInt(process.env.DB_PORT as string, 10) || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    name: process.env.DB_NAME || 'postgres',
  },
  jwt: {
    refresh: {
      secret: process.env.JWT_REFRESH_SECRET || '9jö2lku72378askj2ö3jaddwded2d',
      expiration: process.env.JWT_REFRESH_EXPIRATION || '7d',
    },
    access: {
      secret: process.env.JWT_ACCESS_SECRET || 'kdjkjuhklöjasd72kjd7234jk8238',
      expiration: process.env.JWT_ACCESS_EXPIRATION || '8h',
    },
  },
});
