import { Request, Response } from 'express';
import { getDbAccounts } from 'src/services/accounts';
import { getDbCurrencies, getLatestPrices } from 'src/services/currencies';
import { getPrimaryCurrency } from 'src/services/settings';

export interface NetWorth {
  currency_id: number;
  amount: number;
}

export const getNetWorth = async (req: Request, res: Response) => {
  const accounts = await getDbAccounts(req.user.uid);
  if (!accounts) {
    res.sendStatus(500);
    return;
  }

  const primaryCurrency = await getPrimaryCurrency(req.user.uid);

  if (!accounts.length) {
    res.json({
      currency_id: primaryCurrency,
      amount: 0,
    });
    return;
  }

  const prices = await getLatestPrices();
  const amountUSD = accounts.reduce((acc, current) => {
    if (current.currency_id === 1) {
      return acc + parseFloat(current.balance);
    } else {
      const price = prices.find(
        (x) => x.currency_id === current.currency_id
      ).price;
      if (price) {
        return acc + parseFloat(current.balance) / price;
      }
    }
  }, 0);

  const amount =
    primaryCurrency === 1
      ? amountUSD
      : amountUSD * prices.find((x) => x.currency_id === primaryCurrency).price;

  res.json({
    currency_id: primaryCurrency,
    amount,
  });
};

export const getNetWorthByCurrency = async (req: Request, res: Response) => {
  const accounts = await getDbAccounts(req.user.uid);
  if (!accounts) {
    res.sendStatus(500);
    return;
  }

  const items: NetWorth[] = [];

  const currencies = await getDbCurrencies();
  currencies.forEach((currency) => {
    items.push({ currency_id: currency.id, amount: 0 });
  });

  accounts.forEach((account) => {
    const item = items.find((x) => x.currency_id === account.currency_id);
    if (item) item.amount += parseFloat(account.balance);
  });

  res.json(items);
};
