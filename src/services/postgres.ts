import pg from 'pg';
import env from 'src/utils/env';

const { Client } = pg;

const client = new Client({
  user: env.PG_USER,
  password: env.PG_PASSWORD,
  host: env.PG_HOST,
  port: env.PG_PORT,
  database: env.PG_DB,
});

export default client;
