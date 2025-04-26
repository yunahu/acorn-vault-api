import client from './postgres';

export const accounts = async (uid: string) =>
  client
    .query(
      `SELECT id, name, currency_id, balance, is_primary_payment_method FROM account WHERE firebase_uid = $1 ORDER BY id;`,
      [uid]
    )
    .then((r) => r.rows);
