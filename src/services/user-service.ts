import client from 'src/services/postgres-service';

export const createUser = (uid: string) =>
  client
    .query(`INSERT INTO setting (firebase_uid) VALUES ($1) RETURNING *`, [uid])
    .then((r) => r.rows[0]);

export const getUserSettings = async (uid: string) =>
  client
    .query(`SELECT primary_currency FROM setting WHERE firebase_uid = $1`, [
      uid,
    ])
    .then((r) => r.rows[0]);

export const getPrimaryCurrency = (uid: string) =>
  client
    .query(
      `SELECT currency.* 
			FROM currency 
			INNER JOIN setting on setting.primary_currency = currency.id 
			WHERE setting.firebase_uid = $1`,
      [uid]
    )
    .then((r) => r.rows[0]);

export const getPrimaryCurrencyId = (uid: string) =>
  getUserSettings(uid).then((x) => x?.primary_currency);

export const updateUserSettings = (primaryCurrencyId: number, uid: string) =>
  client
    .query(
      `UPDATE setting SET primary_currency = $1 WHERE firebase_uid = $2 RETURNING *`,
      [primaryCurrencyId, uid]
    )
    .then((r) => r.rows[0]);

export const deleteUserSettings = (uid: string) =>
  client
    .query(`DELETE FROM setting WHERE firebase_uid = $1 RETURNING *`, [uid])
    .then((r) => r.rows[0]);
