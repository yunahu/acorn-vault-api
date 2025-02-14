import client from 'src/services/postgres';
import { retry, timeoutablePromise } from 'src/utils/helpers';

export const prices = async (from: string, to: string, currency_id: string) =>
  retry(() =>
    timeoutablePromise(
      client
        .query(
          `SELECT * FROM price WHERE date >= $1 AND date <= $2 AND currency_id = $3`,
          [from, to, currency_id]
        )
        .then((r) => r.rows)
    )
  );
