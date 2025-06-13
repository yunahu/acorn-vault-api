import client from './postgres-service';

export interface Record {
  id: number;
  date: string;
  description: string;
  account_id: number | null;
  amount: number;
}

export const createRecord = (
  date: string,
  description: string | undefined,
  account_id: number | undefined | null,
  amount: number | undefined,
  uid: string
) =>
  client
    .query(
      `INSERT INTO record (date, description, account_id, amount, firebase_uid) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [date, description, account_id, amount, uid]
    )
    .then((r) => r.rows[0]);

export const getRecord = (id: number, uid: string) =>
  client
    .query(`SELECT * FROM record WHERE id = $1 AND firebase_uid = $2`, [
      id,
      uid,
    ])
    .then((r) => r.rows[0]);

export const getRecords = async (
  uid: string,
  from: string | undefined,
  to: string | undefined
) => {
  const query = `
		SELECT id, date, description, account_id, amount 
		FROM record 
		WHERE 
		firebase_uid = $1
		AND ($2::date IS NULL OR date >= $2)
		AND ($3::date IS NULL OR date <= $3)
		ORDER BY date, id
	`;

  return client.query(query, [uid, from, to]).then((r) => r.rows);
};

export const getRecordsWithAccounts = async (
  uid: string,
  from: string | undefined,
  to: string | undefined
) => {
  const query = `
		SELECT record.id, record.account_id, record.amount, account.currency_id
		FROM record
		LEFT JOIN account
		ON record.account_id = account.id 
		WHERE 
		record.firebase_uid = $1
		AND ($2::date IS NULL OR date >= $2)
		AND ($3::date IS NULL OR date <= $3)
		ORDER BY record.date, record.id
	`;

  return client.query(query, [uid, from, to]).then((r) => r.rows);
};

export const updateRecord = async (
  uid: string,
  id: number,
  data: Partial<Record>
) => {
  let record = await getRecord(id, uid);
  if (!record) return;

  record = { ...record, ...data };

  const result = await client.query(
    `UPDATE record 
		SET date = $1, description = $2, account_id = $3 , amount = $4
		WHERE id = $5 
		AND firebase_uid = $6 
		RETURNING *`,
    [record.date, record.description, record.account_id, record.amount, id, uid]
  );
  return result;
};

export const deleteRecord = (id: number, uid: string) =>
  client
    .query(
      `DELETE FROM record WHERE id = $1 AND firebase_uid = $2 RETURNING *`,
      [id, uid]
    )
    .then((r) => r.rows[0]);

export const deleteUserRecords = (uid: string) =>
  client
    .query(`DELETE FROM account WHERE firebase_uid = $1 RETURNING *`, [uid])
    .then((r) => r.rows);
