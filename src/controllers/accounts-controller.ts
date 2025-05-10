import { Request, Response } from 'express';
import client from 'src/services/postgres';
import { getDbAccounts } from 'src/services/accounts';

export const createAccount = async (req: Request, res: Response) => {
  const { name, currencyId, balance, isPrimaryPaymentMethod } = req.body;
  const newAccount = await client
    .query(
      `INSERT INTO account (name, currency_id, balance, is_primary_payment_method, firebase_uid) VALUES ($1, $2, $3, $4, $5) RETURNING *;`,
      [name, currencyId, balance, isPrimaryPaymentMethod, req.user.uid]
    )
    .then((r) => r.rows[0]);

  newAccount ? res.sendStatus(204) : res.sendStatus(500);
};

export const getAccounts = async (req: Request, res: Response) => {
  const accounts = await getDbAccounts(req.user.uid);
  res.send(accounts);
};

export const updateAccount = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { uid } = req.user;
  const { name, balance, is_primary_payment_method } = req.body;
  const items = { name, balance, is_primary_payment_method };

  const account = await client
    .query(`SELECT * FROM account WHERE id = $1 AND firebase_uid = $2;`, [
      id,
      uid,
    ])
    .then((r) => r.rows[0]);

  if (!account) {
    res.sendStatus(400);
    return;
  }

  const promises = [];
  for (const [key, value] of Object.entries(items)) {
    if (value !== undefined && account[key] !== value) {
      const q = `UPDATE account SET ${key} = $1 WHERE id = $2 AND firebase_uid = $3 RETURNING *;`;
      promises.push(client.query(q, [value, id, uid]).then((r) => r.rows[0]));
    }
  }

  Promise.all(promises)
    .then(() => res.sendStatus(204))
    .catch(() => res.sendStatus(500));
};

export const deleteAccount = async (req: Request, res: Response) => {
  const deletedAccount = await client
    .query(
      `DELETE FROM account WHERE id = $1 AND firebase_uid = $2 RETURNING *;`,
      [req.params.id, req.user.uid]
    )
    .then((r) => r.rows[0]);

  deletedAccount ? res.sendStatus(204) : res.sendStatus(500);
};
