import { Request, Response } from 'express';
import { GetPricesQuery } from 'src/schemas/currencySchemas';
import { getDbCurrencies, getDbPrices } from 'src/services/currencies';

export const getCurrencies = async (_: Request, res: Response) => {
  const currencies = await getDbCurrencies();
  res.send(currencies);
};

export const getPrices = async (
  req: Request<void, void, void, GetPricesQuery>,
  res: Response
) => {
  const { from, to, currencyId } = req.query;
  const prices = await getDbPrices(from, to, currencyId);
  res.send(prices);
};
