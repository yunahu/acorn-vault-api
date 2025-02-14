import { Request, Response } from 'express';
import client from 'src/services/postgres';
import { retry, timeoutablePromise } from 'src/utils/helpers';
import { MOCK_USER_ID } from 'src/utils/constants';

export const getRecords = async (req: Request, res: Response) => {
  const { from, to } = req.query;

  const records = await retry(() =>
    timeoutablePromise(
      client
        .query(
          `SELECT * FROM record WHERE user_id = $1 AND record_date BETWEEN $2 AND $3`,
          [MOCK_USER_ID, from, to]
        )
        .then((r) => r.rows)
    )
  );

  res.send(records);
};

export const createRecord = async (req: Request, res: Response) => {
  const { record_date, description, account_id, amount } = req.body;
  const user_id = MOCK_USER_ID;

  const newRecord = await retry(() =>
    timeoutablePromise(
      client
        .query(
          `INSERT INTO record (record_date, description, account_id, amount, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING *;`,
          [record_date, description, account_id, amount, user_id]
        )
        .then((r) => r.rows[0])
    )
  );

  res.send(newRecord);
};

export const updateRecord = async (req: Request, res: Response) => {
  const updatable = ['record_date', 'description', 'account_id', 'amount'];

  const { column, value } = req.body;

  if (!updatable.includes(column)) {
    res.status(400).send(`Error: '${column}' cannot be updated.`);
  }

  const updatedRecord = await retry(() =>
    timeoutablePromise(
      client
        .query(`UPDATE record SET ${column} = $1 WHERE id = $2 RETURNING *;`, [
          value,
          req.params.id,
        ])
        .then((r) => r.rows[0])
    )
  );

  res.send(updatedRecord);
};

export const deleteRecord = async (req: Request, res: Response) => {
  const deletedRecord = await retry(() =>
    timeoutablePromise(
      client
        .query(`DELETE FROM record WHERE id = $1 RETURNING *;`, [req.params.id])
        .then((r) => r.rows[0])
    )
  );

  res.send(deletedRecord);
};
