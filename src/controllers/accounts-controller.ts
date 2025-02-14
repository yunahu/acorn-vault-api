import { Request, Response } from 'express';
import client from 'src/services/postgres';
import { retry, timeoutablePromise } from 'src/utils/helpers';
import { MOCK_USER_ID } from 'src/utils/constants';

export const accounts = async (req: Request, res: Response) => {
  const userAccounts = await retry(() =>
    timeoutablePromise(
      client
        .query(`SELECT * FROM account WHERE user_id = $1`, [MOCK_USER_ID])
        .then((r) => r.rows)
    )
  );

  res.send(userAccounts);
};

export const createAccount = async (req: Request, res: Response) => {
  const { name, currency_id, balance, is_primary_payment_method } = req.body;

  const newAccount = await retry(() =>
    timeoutablePromise(
      client
        .query(
          `INSERT INTO account (name, currency_id, balance, is_primary_payment_method, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING *;`,
          [name, currency_id, balance, is_primary_payment_method, MOCK_USER_ID]
        )
        .then((r) => r.rows[0])
    )
  );

  res.send(newAccount);
};

export const updateAccount = async (req: Request, res: Response) => {
  const updatable = ['name', 'balance', 'is_primary_payment_method'];

  const { column, value } = req.body;

  if (!updatable.includes(column)) {
    res.status(400).send(`Error: '${column}' cannot be updated.`);
  }

  const updatedAccount = await retry(() =>
    timeoutablePromise(
      client
        .query(`UPDATE account SET ${column} = $1 WHERE id = $2 RETURNING *;`, [
          value,
          req.params.id,
        ])
        .then((r) => r.rows[0])
    )
  );

  res.send(updatedAccount);
};

export const deleteAccount = async (req: Request, res: Response) => {
  const deletedAccount = await retry(() =>
    timeoutablePromise(
      client
        .query(`DELETE FROM account WHERE id = $1 RETURNING *;`, [
          req.params.id,
        ])
        .then((r) => r.rows[0])
    )
  );

  res.send(deletedAccount);
};
