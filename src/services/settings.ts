import client from 'src/services/postgres';

export const createSettings = (uid: string) =>
  client
    .query(`INSERT INTO setting (firebase_uid) VALUES ($1) RETURNING *;`, [uid])
    .then((r) => r.rows[0]);

export const settings = async (uid: string) => {
  const getDbSettings = async (uid: string) =>
    client
      .query(`SELECT primary_currency FROM setting WHERE firebase_uid = $1`, [
        uid,
      ])
      .then((r) => r.rows[0]);

  let data = await getDbSettings(uid);

  if (!data) {
    await createSettings(uid);
    data = await getDbSettings(uid);
  }

  return data;
};

export const deleteSettings = (uid: string) =>
  client
    .query(`DELETE FROM setting WHERE firebase_uid = $1 RETURNING *;`, [uid])
    .then((r) => r.rows[0]);
