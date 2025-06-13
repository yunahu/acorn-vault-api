import { getAccounts } from 'src/services/accounts-service';
import {
  getCurrencies,
  getLatestPrices,
} from 'src/services/currencies-service';
import { getRecordsWithAccounts } from 'src/services/records-service';
import { getPrimaryCurrencyId } from 'src/services/user-service';

export interface AccountStats {
  primary_currency: number;
  net_worth: number;
  rows: {
    currency_id: number;
    amount: number;
    amount_in_PC: number;
    percentage: number;
  }[];
}

export interface RecordStats {
  primary_currency: number;
  currency_unassigned: number;
  assigned_sum: number;
  rows: {
    currency_id: number;
    amount: number;
    amount_in_PC: number;
    percentage: number;
  }[];
}

export const getAccountStats = async (uid: string) => {
  const accounts = await getAccounts(uid);
  const primaryCurrencyId = await getPrimaryCurrencyId(uid);
  const prices = await getLatestPrices();
  const currencies = await getCurrencies();
  if (!accounts || !primaryCurrencyId || !prices || !currencies) {
    return;
  }

  const accountStats: AccountStats = {
    primary_currency: primaryCurrencyId,
    net_worth: 0,
    rows: [],
  };
  const { rows } = accountStats;

  currencies.forEach((currency) => {
    rows.push({
      currency_id: currency.id,
      amount: 0,
      amount_in_PC: 0,
      percentage: 0,
    });
  });

  const pricePC =
    primaryCurrencyId === 1
      ? 1
      : prices.find((x) => x.currency_id === primaryCurrencyId).price;

  let sumInPC = 0;
  for (const current of accounts) {
    const row = rows.find((row) => row.currency_id === current.currency_id);
    if (!row) return;

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
  accountStats.rows = sorted;
  accountStats.net_worth = sumInPC;

  return accountStats;
};

export const getRecordStats = async (
  uid: string,
  from: string | undefined,
  to: string | undefined
) => {
  const records = await getRecordsWithAccounts(uid, from, to);

  const primaryCurrency = await getPrimaryCurrencyId(uid);
  const prices = await getLatestPrices();
  const currencies = await getCurrencies();
  if (!records || !primaryCurrency || !prices || !currencies) {
    return;
  }

  const recordStats: RecordStats = {
    primary_currency: primaryCurrency,
    currency_unassigned: 0,
    assigned_sum: 0,
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
      recordStats.currency_unassigned += parseFloat(current.amount);
      continue;
    }

    const row = rows.find((row) => row.currency_id === current.currency_id);
    if (!row) return;

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
  recordStats.assigned_sum = sumInPC;

  return recordStats;
};
