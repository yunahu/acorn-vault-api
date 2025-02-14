import { Request, Response } from 'express';
import client from 'src/services/postgres';
import { MOCK_USER_ID } from 'src/utils/constants';
import { retry, timeoutablePromise } from 'src/utils/helpers';

export const getSettings = async (req: Request, res: Response) => {
  const settings = await retry(() =>
    timeoutablePromise(
      client
        .query(`SELECT * FROM setting WHERE user_id = $1`, [MOCK_USER_ID])
        .then((r) => r.rows[0])
    )
  );

  res.send(settings);
};

export const updateSettings = async (req: Request, res: Response) => {
  const updatable = ['primary_currency'];
  const user_id = MOCK_USER_ID;

  const { column, value } = req.body;

  if (!updatable.includes(column)) {
    res.status(400).send(`Error: '${column}' cannot be updated.`);
  }

  const updatedSettings = await retry(() =>
    timeoutablePromise(
      client
        .query(
          `UPDATE setting SET ${column} = $1 WHERE user_id = $2 RETURNING *;`,
          [value, user_id]
        )
        .then((r) => r.rows[0])
    )
  );

  res.send(updatedSettings);
};
