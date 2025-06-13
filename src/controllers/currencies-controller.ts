import { Request, Response } from 'express';
import { GetPricesRequest } from 'src/schemas/currencies-schemas';
import * as currenciesService from 'src/services/currencies-service';

export const getCurrencies = async (_: Request, res: Response) => {
  const currencies = await currenciesService.getCurrencies();
  res.json(currencies);
};

export const getPrices = async (req: GetPricesRequest, res: Response) => {
  const { from, to, currency_id } = req.query;
  const prices = await currenciesService.getPrices(from, to, currency_id);
  res.json(prices);
};
