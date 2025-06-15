import client from 'src/services/postgres-service';

export interface Account {
  id: number;
  name: string;
  currency_id: number;
  balance: number;
  is_primary_payment_method: boolean;
}

export const createAccount = async (
  name: string,
  currencyId: number,
  balance: number | undefined,
  isPrimaryPaymentMethod: boolean | undefined,
  uid: string
) =>
  client
    .query(
      `INSERT INTO account (name, currency_id, balance, is_primary_payment_method, firebase_uid) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [name, currencyId, balance, isPrimaryPaymentMethod, uid]
    )
    .then((r) => r.rows[0]);

export const getAccount = (id: number, uid: string) =>
  client
    .query(`SELECT * FROM account WHERE id = $1 AND firebase_uid = $2`, [
      id,
      uid,
    ])
    .then((r) => r.rows[0]);

export const getAccounts = (uid: string) =>
  client
    .query(
      `SELECT id, name, currency_id, balance, is_primary_payment_method FROM account WHERE firebase_uid = $1 ORDER BY id`,
      [uid]
    )
    .then((r) => r.rows);

export const updateAccount = async (
  uid: string,
  id: number,
  data: Partial<Account>
) => {
  let account = await getAccount(id, uid);
  if (!account) return;

  account = { ...account, ...data };

  const q = `UPDATE account 
		SET name = $1, balance = $2, is_primary_payment_method = $3
		WHERE id = $4 
		AND firebase_uid = $5 
		RETURNING *`;

  const result = await client.query(q, [
    account.name,
    account.balance,
    account.is_primary_payment_method,
    id,
    uid,
  ]);

  return result;
};

export const deleteAccount = (id: number, uid: string) =>
  client
    .query(
      `DELETE FROM account WHERE id = $1 AND firebase_uid = $2 RETURNING *`,
      [id, uid]
    )
    .then((r) => r.rows[0]);

export const deleteAccounts = (uid: string) =>
  client
    .query(`DELETE FROM account WHERE firebase_uid = $1 RETURNING *`, [uid])
    .then((r) => r.rows);
