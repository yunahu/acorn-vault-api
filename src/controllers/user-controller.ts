import { Request, Response } from 'express';
import { UpdateUserSettingsRequest } from 'src/schemas/user-schemas';
import { deleteAccounts } from 'src/services/accounts-service';
import { deleteUserRecords } from 'src/services/records-service';
import * as userService from 'src/services/user-service';

export const createUser = async (req: Request, res: Response) => {
  const newUser = await userService.createUser(req.user.uid);
  newUser ? res.sendStatus(204) : res.sendStatus(500);
};

export const getUserSettings = async (req: Request, res: Response) => {
  const settings = await userService.getUserSettings(req.user.uid);
  settings ? res.json(settings) : res.sendStatus(500);
};

export const updateUserSettings = async (
  req: UpdateUserSettingsRequest,
  res: Response
) => {
  const { primary_currency_id } = req.body;

  if (!primary_currency_id) {
    res.sendStatus(204);
    return;
  }

  const updatedSettings = await userService.updateUserSettings(
    primary_currency_id,
    req.user.uid
  );

  updatedSettings ? res.sendStatus(204) : res.sendStatus(500);
};

export const deleteUser = async (req: Request, res: Response) => {
  const uid = req.user.uid;
  try {
    const deletingSettings = userService.deleteUserSettings(uid);
    const deletingRecords = deleteUserRecords(uid);
    const deletingAccounts = deleteAccounts(uid);
    await Promise.all([deletingSettings, deletingRecords, deletingAccounts]);
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};
