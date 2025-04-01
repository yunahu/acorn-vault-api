import { Request, Response } from 'express';
import client from 'src/services/postgres';
import { prices } from 'src/services/prices';

export const getCurrencies = async (req: Request, res: Response) => {
  const currencies = await client
    .query(`SELECT * FROM currency`)
    .then((r) => r.rows);

  res.send(currencies);
};

export const getPrices = async (req: Request, res: Response) => {
  const { from, to, currencyId } = req.query;

  const data = await prices(from as string, to as string, currencyId as string);

  res.send(data);
};
