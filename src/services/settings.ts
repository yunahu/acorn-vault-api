import client from 'src/services/postgres';
import { retry, timeoutablePromise } from 'src/utils/helpers';

export const createSettings = (user_id: number) =>
  retry(() =>
    timeoutablePromise(
      client
        .query(`INSERT INTO setting (user_id) VALUES ($1) RETURNING *;`, [
          user_id,
        ])
        .then((r) => r.rows[0])
    )
  );

export const deleteSettings = (user_id: number) =>
  retry(() =>
    timeoutablePromise(
      client
        .query(`DELETE FROM setting WHERE user_id = $1 RETURNING *;`, [user_id])
        .then((r) => r.rows[0])
    )
  );
