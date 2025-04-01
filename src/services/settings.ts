import client from 'src/services/postgres';

export const createSettings = (uid: number) =>
  client
    .query(`INSERT INTO setting (firebase_uid) VALUES ($1) RETURNING *;`, [uid])
    .then((r) => r.rows[0]);

export const deleteSettings = (uid: number) =>
  client
    .query(`DELETE FROM setting WHERE firebase_uid = $1 RETURNING *;`, [uid])
    .then((r) => r.rows[0]);
