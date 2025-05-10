import express from 'express';
import {
  getCurrencies,
  getPrices,
} from 'src/controllers/currencies-controller';
import validate from 'src/middlewares/validators';
import { getPricesSchema } from 'src/schemas/currencySchemas';

const currenciesRouter = express.Router();

currenciesRouter.get('/', getCurrencies);
currenciesRouter.get('/prices', validate(getPricesSchema), getPrices);

export default currenciesRouter;
