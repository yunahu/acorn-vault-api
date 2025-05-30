import express from 'express';
import {
  createAccount,
  deleteAccount,
  getAccounts,
  updateAccount,
} from 'src/controllers/accounts-controller';
import validate from 'src/middlewares/validators';
import {
  createAccountSchema,
  deleteAccountSchema,
  updateAccountSchema,
} from 'src/schemas/accountSchemas';

const accountsRouter = express.Router();

accountsRouter.post('/', validate(createAccountSchema), createAccount);
accountsRouter.get('/', getAccounts);
accountsRouter.patch('/:id', validate(updateAccountSchema), updateAccount);
accountsRouter.delete('/:id', validate(deleteAccountSchema), deleteAccount);

export default accountsRouter;
