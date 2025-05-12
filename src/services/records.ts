import client from './postgres';

export const getDbRecords = async (
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
		ORDER BY date, id;
	`;

  return client.query(query, [uid, from, to]).then((r) => r.rows);
};

export const getDbRecordsWithAccounts = async (
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
		ORDER BY record.date, record.id;
	`;

  return client.query(query, [uid, from, to]).then((r) => r.rows);
};
