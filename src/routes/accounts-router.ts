import express from 'express';
import {
  getAccounts,
  createAccount,
  updateAccount,
  deleteAccount,
} from 'src/controllers/accounts-controller';

const accountsRouter = express.Router();

accountsRouter.get('/', getAccounts);
accountsRouter.post('/', createAccount);
accountsRouter.patch('/:id', updateAccount);
accountsRouter.delete('/:id', deleteAccount);

export default accountsRouter;
