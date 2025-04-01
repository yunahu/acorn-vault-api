import { Request, Response } from 'express';
import client from 'src/services/postgres';

export const getRecords = async (req: Request, res: Response) => {
  const { from, to } = req.query;

  const records = await client
    .query(
      `SELECT id, date, description, account_id, amount FROM record WHERE firebase_uid = $1 AND date BETWEEN $2 AND $3;`,
      [req.user.uid, from, to]
    )
    .then((r) => r.rows);

  res.send(records);
};

export const createRecord = async (req: Request, res: Response) => {
  const { date, description, account_id, amount } = req.body;

  const newRecord = await client
    .query(
      `INSERT INTO record (date, description, account_id, amount, firebase_uid) VALUES ($1, $2, $3, $4, $5) RETURNING *;`,
      [date, description, account_id, amount, req.user.uid]
    )
    .then((r) => r.rows[0]);

  res.send(newRecord);
};

export const updateRecord = async (req: Request, res: Response) => {
  const updatable = ['date', 'description', 'account_id', 'amount'];

  const { column, value } = req.body;

  if (!updatable.includes(column)) {
    res.status(400).send(`Error: '${column}' cannot be updated.`);
  }

  const updatedRecord = await client
    .query(`UPDATE record SET ${column} = $1 WHERE id = $2 RETURNING *;`, [
      value,
      req.params.id,
    ])
    .then((r) => r.rows[0]);

  res.send(updatedRecord);
};

export const deleteRecord = async (req: Request, res: Response) => {
  const deletedRecord = await client
    .query(`DELETE FROM record WHERE id = $1 RETURNING *;`, [req.params.id])
    .then((r) => r.rows[0]);

  res.send(deletedRecord);
};
