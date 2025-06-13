import { Request, Response } from 'express';
import * as cryptoService from 'src/services/crypto-service';

export const getCoins = async (_: Request, res: Response) => {
  const coins = await cryptoService.getCoins();
  coins ? res.json(coins) : res.sendStatus(500);
};

export const getCoinPrices = async (req: Request, res: Response) => {
  const coinPrices = await cryptoService.getCoinPrices(req.user.uid);
  coinPrices ? res.json(coinPrices) : res.sendStatus(500);
};
