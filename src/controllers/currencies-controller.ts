import { Request, Response } from 'express';
import { getDbCurrencies, getDbPrices } from 'src/services/currencies';

export const getCurrencies = async (_: Request, res: Response) => {
  const currencies = await getDbCurrencies();

  res.send(currencies);
};

export const getPrices = async (req: Request, res: Response) => {
  const { from, to, currencyId } = req.query;

  const prices = await getDbPrices(
    from as string,
    to as string,
    currencyId as string
  );

  res.send(prices);
};
