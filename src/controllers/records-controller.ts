import { Request, Response } from 'express';
import client from 'src/services/postgres';
import { GetRecordsQuery } from 'src/schemas/recordSchemas';
import { getDbRecords } from 'src/services/records';

export const createRecord = async (req: Request, res: Response) => {
  const { date, description, accountId, amount } = req.body;
  const newRecord = await client
    .query(
      `INSERT INTO record (date, description, account_id, amount, firebase_uid) VALUES ($1, $2, $3, $4, $5) RETURNING *;`,
      [date, description, accountId, amount, req.user.uid]
    )
    .then((r) => r.rows[0]);

  newRecord ? res.sendStatus(204) : res.sendStatus(500);
};

export const getRecords = async (
  req: Request<void, void, void, GetRecordsQuery>,
  res: Response
) => {
  const { from, to } = req.query;
  const records = await getDbRecords(req.user.uid, from, to);
  res.send(records);
};

export const updateRecord = async (req: Request, res: Response) => {
  const { uid } = req.user;
  const { id } = req.params;
  const { date, description, account_id, amount } = req.body;
  const items = { date, description, account_id, amount };

  const record = await client
    .query(`SELECT * FROM record WHERE id = $1 AND firebase_uid = $2;`, [
      id,
      uid,
    ])
    .then((r) => r.rows[0]);

  if (!record) {
    res.sendStatus(400);
    return;
  }

  const promises = [];
  for (const [key, value] of Object.entries(items)) {
    if (value !== undefined && record[key] !== value) {
      const q = `UPDATE record SET ${key} = $1 WHERE id = $2 AND firebase_uid = $3 RETURNING *;`;
      promises.push(client.query(q, [value, id, uid]).then((r) => r.rows[0]));
    }
  }

  Promise.all(promises)
    .then(() => res.sendStatus(204))
    .catch(() => res.sendStatus(500));
};

export const deleteRecord = async (req: Request, res: Response) => {
  const deletedRecord = await client
    .query(
      `DELETE FROM record WHERE id = $1 AND firebase_uid = $2 RETURNING *;`,
      [req.params.id, req.user.uid]
    )
    .then((r) => r.rows[0]);

  deletedRecord ? res.sendStatus(204) : res.sendStatus(500);
};
