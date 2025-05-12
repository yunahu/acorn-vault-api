import { Request, Response } from 'express';
import { getRecordStatsQuery } from 'src/schemas/statisticsSchemas';
import { getDbAccounts } from 'src/services/accounts';
import { getDbCurrencies, getLatestPrices } from 'src/services/currencies';
import { getDbRecordsWithAccounts } from 'src/services/records';
import { getPrimaryCurrency } from 'src/services/settings';

export interface NetWorth {
  currency_id: number;
  amount: number;
}

export interface NetWorthByCurrency {
  primary_currency: number;
  rows: {
    currency_id: number;
    amount: number;
    amount_in_PC: number;
    percentage: number;
  }[];
}

export interface RecordStats {
  primary_currency: number;
  currencyUnassigned: number;
  rows: {
    currency_id: number;
    amount: number;
    amount_in_PC: number;
    percentage: number;
  }[];
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
  const primaryCurrency = await getPrimaryCurrency(req.user.uid);
  const prices = await getLatestPrices();
  const currencies = await getDbCurrencies();
  if (!accounts || !primaryCurrency || !prices || !currencies) {
    res.sendStatus(500);
    return;
  }

  const netWorthByCurrency: NetWorthByCurrency = {
    primary_currency: primaryCurrency,
    rows: [],
  };
  const { rows } = netWorthByCurrency;

  currencies.forEach((currency) => {
    rows.push({
      currency_id: currency.id,
      amount: 0,
      amount_in_PC: 0,
      percentage: 0,
    });
  });

  const pricePC =
    primaryCurrency === 1
      ? 1
      : prices.find((x) => x.currency_id === primaryCurrency).price;

  let sumInPC = 0;
  for (const current of accounts) {
    const row = rows.find((row) => row.currency_id === current.currency_id);
    if (!row) {
      res.sendStatus(500);
      return;
    }

    const price =
      current.currency_id === 1
        ? 1
        : prices.find((x) => x.currency_id === current.currency_id).price;

    const amountInPC = (parseFloat(current.balance) / price) * pricePC;
    row.amount += parseFloat(current.balance);
    row.amount_in_PC += amountInPC;
    sumInPC += amountInPC;
  }

  rows.forEach((row) => {
    row.percentage = (row.amount_in_PC / sumInPC) * 100;
  });

  const nonZeroRows = rows.filter((x) => x.amount !== 0);
  const sorted = nonZeroRows.sort((a, b) => b.amount_in_PC - a.amount_in_PC);
  netWorthByCurrency.rows = sorted;

  res.json(netWorthByCurrency);
};

export const getRecordStats = async (
  req: Request<void, void, void, getRecordStatsQuery>,
  res: Response
) => {
  const { from, to } = req.query;

  const records = await getDbRecordsWithAccounts(req.user.uid, from, to);

  const primaryCurrency = await getPrimaryCurrency(req.user.uid);
  const prices = await getLatestPrices();
  const currencies = await getDbCurrencies();
  if (!records || !primaryCurrency || !prices || !currencies) {
    console.log(1);
    res.sendStatus(500);
    return;
  }

  const recordStats: RecordStats = {
    primary_currency: primaryCurrency,
    currencyUnassigned: 0,
    rows: [],
  };
  const { rows } = recordStats;

  currencies.forEach((currency) => {
    rows.push({
      currency_id: currency.id,
      amount: 0,
      amount_in_PC: 0,
      percentage: 0,
    });
  });

  const pricePC =
    primaryCurrency === 1
      ? 1
      : prices.find((x) => x.currency_id === primaryCurrency).price;

  let sumInPC = 0;
  for (const current of records) {
    if (current.currency_id === null) {
      recordStats.currencyUnassigned += parseFloat(current.amount);
      continue;
    }

    const row = rows.find((row) => row.currency_id === current.currency_id);
    if (!row) {
      res.sendStatus(500);
      return;
    }

    const price =
      current.currency_id === 1
        ? 1
        : prices.find((x) => x.currency_id === current.currency_id).price;

    const amountInPC = (parseFloat(current.amount) / price) * pricePC;
    row.amount += parseFloat(current.amount);
    row.amount_in_PC += amountInPC;
    sumInPC += amountInPC;
  }

  rows.forEach((row) => {
    row.percentage = row.currency_id ? (row.amount_in_PC / sumInPC) * 100 : 0;
  });

  const nonZeroRows = rows.filter((x) => x.amount !== 0);
  const sorted = nonZeroRows.sort((a, b) => b.amount_in_PC - a.amount_in_PC);
  recordStats.rows = sorted;

  res.json(recordStats);
};
