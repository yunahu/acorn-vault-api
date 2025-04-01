import express, { NextFunction, Request, Response } from 'express';
import {
  getCurrencies,
  getPrices,
} from 'src/controllers/currencies-controller';

const currenciesRouter = express.Router();

const validateQuery = (req: Request, res: Response, next: NextFunction) => {
  if (
    typeof req.query.from !== 'string' ||
    typeof req.query.to !== 'string' ||
    typeof req.query.currencyId !== 'string'
  )
    res.status(400).json({ message: 'Error: Invalid query values' });

  next();
};

currenciesRouter.get('/', getCurrencies);
currenciesRouter.get('/prices', validateQuery, getPrices);

export default currenciesRouter;
