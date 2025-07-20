import express from 'express';
import {
  getCurrencies,
  getPrices,
  getPrimaryCurrencyPrice,
} from 'src/controllers/currencies-controller';
import authenticate from 'src/middlewares/authenticators';
import validate from 'src/middlewares/validators';
import { getPricesSchema } from 'src/schemas/currencies-schemas';

const currenciesRouter = express.Router();

currenciesRouter.get('/', getCurrencies);
currenciesRouter.get('/prices', validate(getPricesSchema), getPrices);
currenciesRouter.get(
  '/primary_currency_price',
  authenticate,
  getPrimaryCurrencyPrice
);

export default currenciesRouter;
