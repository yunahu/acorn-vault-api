import { Request, Response } from 'express';
import { currencies, prices } from 'src/services/currencies';

export const getCurrencies = async (req: Request, res: Response) => {
  const data = await currencies();

  res.send(data);
};

export const getPrices = async (req: Request, res: Response) => {
  const { from, to, currencyId } = req.query;

  const data = await prices(from as string, to as string, currencyId as string);

  res.send(data);
};
