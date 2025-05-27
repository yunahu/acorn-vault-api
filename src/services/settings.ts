import client from 'src/services/postgres';

export const createSettings = (uid: string) =>
  client
    .query(`INSERT INTO setting (firebase_uid) VALUES ($1) RETURNING *;`, [uid])
    .then((r) => r.rows[0]);

export const getDbSettings = async (uid: string) => {
  const fetch = async (uid: string) =>
    client
      .query(`SELECT primary_currency FROM setting WHERE firebase_uid = $1`, [
        uid,
      ])
      .then((r) => r.rows[0]);

  let settings = await fetch(uid);

  if (!settings) {
    await createSettings(uid);
    settings = await fetch(uid);
  }

  return settings;
};

export const getPrimaryCurrencyId = async (uid: string) =>
  getDbSettings(uid).then((x) => x?.primary_currency);

export const deleteSettings = (uid: string) =>
  client
    .query(`DELETE FROM setting WHERE firebase_uid = $1 RETURNING *;`, [uid])
    .then((r) => r.rows[0]);
