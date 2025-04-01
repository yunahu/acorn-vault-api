import { Request, Response } from 'express';
import client from 'src/services/postgres';

export const getAccounts = async (req: Request, res: Response) => {
  const accounts = await client
    .query(
      `SELECT id, name, currency_id, balance, is_primary_payment_method FROM account WHERE firebase_uid = $1 ORDER BY id;`,
      [req.user.uid]
    )
    .then((r) => r.rows);

  res.send(accounts);
};

export const createAccount = async (req: Request, res: Response) => {
  const { name, currency_id, balance, is_primary_payment_method } = req.body;

  const newAccount = await client
    .query(
      `INSERT INTO account (name, currency_id, balance, is_primary_payment_method, firebase_uid) VALUES ($1, $2, $3, $4, $5) RETURNING *;`,
      [name, currency_id, balance, is_primary_payment_method, req.user.uid]
    )
    .then((r) => r.rows[0]);

  res.send(newAccount);
};

export const updateAccount = async (req: Request, res: Response) => {
  const updatable = ['name', 'balance', 'is_primary_payment_method'];

  const { column, value } = req.body;

  if (!updatable.includes(column)) {
    res.status(400).send(`Error: '${column}' cannot be updated.`);
  }

  const updatedAccount = client
    .query(`UPDATE account SET ${column} = $1 WHERE id = $2 RETURNING *;`, [
      value,
      req.params.id,
    ])
    .then((r) => r.rows[0]);

  res.send(updatedAccount);
};

export const deleteAccount = async (req: Request, res: Response) => {
  const deletedAccount = await client
    .query(`DELETE FROM account WHERE id = $1 RETURNING *;`, [req.params.id])
    .then((r) => r.rows[0]);

  res.send(deletedAccount);
};
