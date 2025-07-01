import { getAccounts } from 'src/services/accounts-service';
import {
  getCurrencies,
  getLatestPrices,
} from 'src/services/currencies-service';
import { getRecordsWithAccounts } from 'src/services/records-service';
import { getPrimaryCurrencyId } from 'src/services/user-service';

export interface BreakdownItem {
  amount: number;
  amount_in_PC: number; // amount in user's primary currency
  percentage: number;
}

export interface CurrencyBreakdownItem extends BreakdownItem {
  currency_id: number;
}

export interface AccountStats {
  primary_currency: number;
  net_worth: number;
  assets: {
    sum: number;
    currency_breakdown: CurrencyBreakdownItem[];
  };
  liabilities: {
    sum: number;
    currency_breakdown: CurrencyBreakdownItem[];
  };
}

export interface RecordStats {
  primary_currency: number;
  sum: number;
  currency_unassigned: number;
  currency_breakdown: CurrencyBreakdownItem[];
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
    assets: {
      sum: 0,
      currency_breakdown: [],
    },
    liabilities: {
      sum: 0,
      currency_breakdown: [],
    },
    net_worth: 0,
  };

  const { assets, liabilities } = accountStats;

  const assetsAndLiabilities = [assets, liabilities];

  currencies.forEach((currency) => {
    assetsAndLiabilities.forEach((x) => {
      x.currency_breakdown.push({
        currency_id: currency.id,
        amount: 0,
        amount_in_PC: 0,
        percentage: 0,
      });
    });
  });

  const pricePC =
    primaryCurrencyId === 1
      ? 1
      : prices.find((x) => x.currency_id === primaryCurrencyId).price;

  for (const current of accounts) {
    const item = (
      current.balance < 0 ? liabilities : assets
    ).currency_breakdown.find(
      (item) => item.currency_id === current.currency_id
    );
    if (!item) return;

    const price =
      current.currency_id === 1
        ? 1
        : prices.find((x) => x.currency_id === current.currency_id).price;

    const amountInPC = (parseFloat(current.balance) / price) * pricePC;
    item.amount += parseFloat(current.balance);
    item.amount_in_PC += amountInPC;
    (current.balance < 0 ? liabilities : assets).sum += amountInPC;
  }

  assetsAndLiabilities.forEach((x) => {
    if (x.sum === 0) return;

    x.currency_breakdown.forEach((item) => {
      item.percentage = (item.amount_in_PC / x.sum) * 100;
    });

    const orderDescending = (
      a: CurrencyBreakdownItem,
      b: CurrencyBreakdownItem
    ) => b.amount_in_PC - a.amount_in_PC;
    const orderAscending = (
      a: CurrencyBreakdownItem,
      b: CurrencyBreakdownItem
    ) => a.amount_in_PC - b.amount_in_PC;

    const nonZeroItems = x.currency_breakdown.filter((k) => k.amount !== 0);
    const sorted = nonZeroItems.sort(
      x.sum > 0 ? orderDescending : orderAscending
    );
    x.currency_breakdown = sorted;
  });
  accountStats.net_worth = assets.sum + liabilities.sum;

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
    sum: 0,
    currency_unassigned: 0,
    currency_breakdown: [],
  };

  const { currency_breakdown } = recordStats;

  currencies.forEach((currency) => {
    currency_breakdown.push({
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

    const item = currency_breakdown.find(
      (item) => item.currency_id === current.currency_id
    );
    if (!item) return;

    const price =
      current.currency_id === 1
        ? 1
        : prices.find((x) => x.currency_id === current.currency_id).price;

    const amountInPC = (parseFloat(current.amount) / price) * pricePC;
    item.amount += parseFloat(current.amount);
    item.amount_in_PC += amountInPC;
    sumInPC += amountInPC;
  }

  currency_breakdown.forEach((item) => {
    item.percentage = item.currency_id
      ? (item.amount_in_PC / sumInPC) * 100
      : 0;
  });

  const nonZeroItems = currency_breakdown.filter((x) => x.amount !== 0);
  const sorted = nonZeroItems.sort((a, b) => b.amount_in_PC - a.amount_in_PC);
  recordStats.currency_breakdown = sorted;
  recordStats.sum = sumInPC;

  return recordStats;
};
