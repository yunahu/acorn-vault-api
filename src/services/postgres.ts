import dayjs from 'dayjs';
import pg, { types } from 'pg';
import env from 'src/utils/env';

// Override DATE type conversion to UTC
types.setTypeParser(1082, (str) => dayjs.utc(str));

const { Client } = pg;

const client = new Client({
  user: env.PG_USER,
  password: env.PG_PASSWORD,
  host: env.PG_HOST,
  port: env.PG_PORT,
  database: env.PG_DB,
});

export default client;
