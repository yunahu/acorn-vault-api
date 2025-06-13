import { Request, Response } from 'express';
import {
  CreateAccountRequest,
  DeleteAccountRequest,
  UpdateAccountRequest,
} from 'src/schemas/accounts-schemas';
import * as accountsService from 'src/services/accounts-service';

export const createAccount = async (
  req: CreateAccountRequest,
  res: Response
) => {
  const { name, currency_id, balance, is_primary_payment_method } = req.body;
  const newAccount = await accountsService.createAccount(
    name,
    currency_id,
    balance,
    is_primary_payment_method,
    req.user.uid
  );

  newAccount ? res.sendStatus(204) : res.sendStatus(500);
};

export const getAccounts = async (req: Request, res: Response) => {
  const accounts = await accountsService.getAccounts(req.user.uid);
  res.json(accounts);
};

export const updateAccount = async (
  req: UpdateAccountRequest,
  res: Response
) => {
  const result = await accountsService.updateAccount(
    req.user.uid,
    req.params.id,
    req.body
  );

  result ? res.sendStatus(204) : res.sendStatus(500);
};

export const deleteAccount = async (
  req: DeleteAccountRequest,
  res: Response
) => {
  const deletedAccount = await accountsService.deleteAccount(
    req.params.id,
    req.user.uid
  );
  deletedAccount ? res.sendStatus(204) : res.sendStatus(500);
};
