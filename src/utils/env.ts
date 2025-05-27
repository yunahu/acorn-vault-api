import 'dotenv/config';

interface Environment {
  PORT: number;
  PG_USER: string;
  PG_PASSWORD: string;
  PG_HOST: string;
  PG_PORT: number;
  PG_DB: string;
  COINGECKO_API_KEY: string;
}

const env: Environment = {
  PORT: parseInt(process.env.PORT ?? '3000'),
  PG_USER: process.env.PG_USER ?? 'postgres',
  PG_PASSWORD: process.env.PG_PASSWORD!,
  PG_HOST: process.env.PG_HOST!,
  PG_PORT: parseInt(process.env.PG_PORT ?? '5432'),
  PG_DB: process.env.PG_DB!,
  COINGECKO_API_KEY: process.env.COINGECKO_API_KEY!,
};

export default env;
