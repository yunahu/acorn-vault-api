import { Request, Response } from 'express';
import client from 'src/services/postgres';
import { containRequiredFields } from 'src/utils/validation';

export const getRecords = async (req: Request, res: Response) => {
  const { from, to } = req.query;

  const query = `
			SELECT id, date, description, account_id, amount 
			FROM record 
			WHERE 
			firebase_uid = $1
			AND ($2::date IS NULL OR date >= $2)
			AND ($3::date IS NULL OR date <= $3)
			ORDER BY date, id;
		`;

  const records = await client
    .query(query, [req.user.uid, from, to])
    .then((r) => r.rows);

  res.send(records);
};

export const createRecord = async (req: Request, res: Response) => {
  const { date, description, accountId, amount } = req.body;
  if (!containRequiredFields({ date, description }, res)) return;

  const newRecord = await client
    .query(
      `INSERT INTO record (date, description, account_id, amount, firebase_uid) VALUES ($1, $2, $3, $4, $5) RETURNING *;`,
      [date, description, accountId, amount, req.user.uid]
    )
    .then((r) => r.rows[0]);

  newRecord ? res.sendStatus(204) : res.sendStatus(500);
};

export const updateRecord = async (req: Request, res: Response) => {
  const { column, value } = req.body;
  if (!containRequiredFields({ column, value }, res)) return;

  const updatable = ['date', 'description', 'account_id', 'amount'];
  if (!updatable.includes(column)) {
    res.status(400).json({
      message: `'${column}' cannot be updated.`,
    });
    return;
  }

  const updatedRecord = await client
    .query(`UPDATE record SET ${column} = $1 WHERE id = $2 RETURNING *;`, [
      value,
      req.params.id,
    ])
    .then((r) => r.rows[0]);

  updatedRecord ? res.sendStatus(204) : res.sendStatus(500);
};

export const deleteRecord = async (req: Request, res: Response) => {
  const id = req.params.id;
  if (!containRequiredFields({ id }, res)) return;

  const deletedRecord = await client
    .query(`DELETE FROM record WHERE id = $1 RETURNING *;`, [id])
    .then((r) => r.rows[0]);

  deletedRecord ? res.sendStatus(204) : res.sendStatus(500);
};
