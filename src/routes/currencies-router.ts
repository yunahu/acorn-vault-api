import express, { NextFunction, Request, Response } from 'express';
import {
  getCurrencies,
  getPrices,
} from 'src/controllers/currencies-controller';
import { containRequiredFields } from 'src/utils/validation';

const currenciesRouter = express.Router();

const validateQuery = (req: Request, res: Response, next: NextFunction) => {
  const { from, to, currencyId } = req.query;
  if (!containRequiredFields({ from, to, currencyId }, res)) return;

  if (
    typeof from !== 'string' ||
    typeof to !== 'string' ||
    typeof currencyId !== 'string'
  ) {
    res.status(400).json({ message: 'Invalid query values' });
    return;
  }

  next();
};

currenciesRouter.get('/', getCurrencies);
currenciesRouter.get('/prices', validateQuery, getPrices);

export default currenciesRouter;
