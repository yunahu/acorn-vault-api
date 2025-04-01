import { Request, Response } from 'express';
import client from 'src/services/postgres';

export const getSettings = async (req: Request, res: Response) => {
  const settings = await client
    .query(`SELECT primary_currency FROM setting WHERE firebase_uid = $1`, [
      req.user.uid,
    ])
    .then((r) => r.rows[0]);

  res.send(settings);
};

export const updateSettings = async (req: Request, res: Response) => {
  const updatable = ['primary_currency'];

  const { column, value } = req.body;

  if (!updatable.includes(column)) {
    res.status(400).send(`Error: '${column}' cannot be updated.`);
  }

  const updatedSettings = await client
    .query(
      `UPDATE setting SET ${column} = $1 WHERE firebase_uid = $2 RETURNING *;`,
      [value, req.user.uid]
    )
    .then((r) => r.rows[0]);

  res.send(updatedSettings);
};
