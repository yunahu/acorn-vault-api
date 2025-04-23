import { Request, Response } from 'express';
import client from 'src/services/postgres';
import { containRequiredFields } from 'src/utils/validation';

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
  const { name, currencyId, balance, isPrimaryPaymentMethod } = req.body;
  if (!containRequiredFields({ name, currencyId }, res)) return;

  const newAccount = await client
    .query(
      `INSERT INTO account (name, currency_id, balance, is_primary_payment_method, firebase_uid) VALUES ($1, $2, $3, $4, $5) RETURNING *;`,
      [name, currencyId, balance, isPrimaryPaymentMethod, req.user.uid]
    )
    .then((r) => r.rows[0]);

  newAccount ? res.sendStatus(204) : res.sendStatus(500);
};

export const updateAccount = async (req: Request, res: Response) => {
  const { column, value } = req.body;
  if (!containRequiredFields({ column, value }, res)) return;

  const updatable = ['name', 'balance', 'is_primary_payment_method'];
  if (!updatable.includes(column)) {
    res.status(400).json({
      message: `'${column}' cannot be updated.`,
    });
    return;
  }

  const updatedAccount = await client
    .query(`UPDATE account SET ${column} = $1 WHERE id = $2 RETURNING *;`, [
      value,
      req.params.id,
    ])
    .then((r) => r.rows[0]);

  updatedAccount ? res.sendStatus(204) : res.sendStatus(500);
};

export const deleteAccount = async (req: Request, res: Response) => {
  const id = req.params.id;
  if (!containRequiredFields({ id }, res)) return;

  const deletedAccount = await client
    .query(`DELETE FROM account WHERE id = $1 RETURNING *;`, [id])
    .then((r) => r.rows[0]);

  deletedAccount ? res.sendStatus(204) : res.sendStatus(500);
};
