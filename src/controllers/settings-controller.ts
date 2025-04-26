import { Request, Response } from 'express';
import client from 'src/services/postgres';
import { settings } from 'src/services/settings';
import { containRequiredFields } from 'src/utils/validation';

export const getSettings = async (req: Request, res: Response) => {
  const data = await settings(req.user.uid);

  data ? res.send(data) : res.sendStatus(500);
};

export const updateSettings = async (req: Request, res: Response) => {
  const { column, value } = req.body;
  if (!containRequiredFields({ column }, res)) return;

  const updatable = ['primary_currency'];
  if (!updatable.includes(column)) `'${column}' cannot be updated.`;

  const updatedSettings = await client
    .query(
      `UPDATE setting SET ${column} = $1 WHERE firebase_uid = $2 RETURNING *;`,
      [value, req.user.uid]
    )
    .then((r) => r.rows[0]);

  updatedSettings ? res.sendStatus(204) : res.sendStatus(500);
};
