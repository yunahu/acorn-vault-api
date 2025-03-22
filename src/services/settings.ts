import client from 'src/services/postgres';

export const createSettings = (user_id: number) =>
  client
    .query(`INSERT INTO setting (user_id) VALUES ($1) RETURNING *;`, [user_id])
    .then((r) => r.rows[0]);

export const deleteSettings = (user_id: number) =>
  client
    .query(`DELETE FROM setting WHERE user_id = $1 RETURNING *;`, [user_id])
    .then((r) => r.rows[0]);
