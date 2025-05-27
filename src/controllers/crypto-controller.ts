import { Request, Response } from 'express';
import { getCoingeckoPrices } from 'src/services/coingecko';
import { getDbCurrencyById } from 'src/services/currencies';
import client from 'src/services/postgres';
import { getPrimaryCurrencyId } from 'src/services/settings';

export const getCoins = async (_: Request, res: Response) => {
  const coins = await client.query(`SELECT * FROM coin`).then((r) => r.rows);
  coins ? res.json(coins) : res.sendStatus(500);
};

export const getCoinPrices = async (req: Request, res: Response) => {
  const primaryCurrencyId = await getPrimaryCurrencyId(req.user.uid);
  const { code, symbol } = await getDbCurrencyById(primaryCurrencyId);
  const prices = await getCoingeckoPrices(code.toLowerCase());
  prices
    ? res.json({ currency: { code, symbol }, prices })
    : res.sendStatus(500);
};
