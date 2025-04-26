import express from 'express';
import {
  createAccount,
  getAccounts,
  updateAccount,
  deleteAccount,
} from 'src/controllers/accounts-controller';

const accountsRouter = express.Router();

accountsRouter.post('/', createAccount);
accountsRouter.get('/', getAccounts);
accountsRouter.patch('/:id', updateAccount);
accountsRouter.delete('/:id', deleteAccount);

export default accountsRouter;
