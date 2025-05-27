import { Request, Response } from 'express';
import client from 'src/services/postgres';
import { getDbSettings, deleteSettings } from 'src/services/settings';

export const getSettings = async (req: Request, res: Response) => {
  const settings = await getDbSettings(req.user.uid);

  settings ? res.json(settings) : res.sendStatus(500);
};

export const updateSettings = async (req: Request, res: Response) => {
  const { primary_currency } = req.body;

  if (!primary_currency) {
    res.sendStatus(204);
    return;
  }

  const updatedSettings = await client
    .query(
      `UPDATE setting SET primary_currency = $1 WHERE firebase_uid = $2 RETURNING *;`,
      [primary_currency, req.user.uid]
    )
    .then((r) => r.rows[0]);

  updatedSettings ? res.sendStatus(204) : res.sendStatus(500);
};

export const deleteUser = async (req: Request, res: Response) => {
  const uid = req.user.uid;
  try {
    const deletingSettings = deleteSettings(uid);
    const deletingRecords = client.query(
      `DELETE FROM record WHERE firebase_uid = $1 RETURNING *;`,
      [uid]
    );
    const deletingAccounts = client.query(
      `DELETE FROM account WHERE firebase_uid = $1 RETURNING *;`,
      [uid]
    );
    await Promise.all([deletingSettings, deletingRecords, deletingAccounts]);
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};
