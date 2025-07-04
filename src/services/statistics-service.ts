import { getAccounts } from 'src/services/accounts-service';
import {
  getCurrencies,
  getLatestPrices,
} from 'src/services/currencies-service';
import { getRecordsWithAccounts } from 'src/services/records-service';
import { getPrimaryCurrencyId } from 'src/services/user-service';

interface BreakdownItem {
  amount: number;
  amount_in_PC: number; // amount in user's primary currency
  percentage: number;
}

interface CurrencyBreakdownItem extends BreakdownItem {
  currency_id: number;
}

interface StatItem {
  sum: number;
  currency_unassigned_sum?: number;
  currency_breakdown: CurrencyBreakdownItem[];
}

export interface AccountStats {
  primary_currency: number;
  net_worth: number;
  assets: StatItem;
  liabilities: StatItem;
}

export interface RecordStats {
  primary_currency: number;
  sum: number;
  income_items: StatItem;
  expense_items: StatItem;
}

const orderAscending = (a: BreakdownItem, b: BreakdownItem) =>
  a.amount_in_PC - b.amount_in_PC;

const orderDescending = (a: BreakdownItem, b: BreakdownItem) =>
  b.amount_in_PC - a.amount_in_PC;

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
    if (x.sum === 0) {
      x.currency_breakdown = [];
      return;
    }

    x.currency_breakdown.forEach((item) => {
      item.percentage = (item.amount_in_PC / x.sum) * 100;
    });

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
    income_items: {
      sum: 0,
      currency_unassigned_sum: 0,
      currency_breakdown: [],
    },
    expense_items: {
      sum: 0,
      currency_unassigned_sum: 0,
      currency_breakdown: [],
    },
  };

  const { income_items, expense_items } = recordStats;
  const incomeAndExpenseItems = [income_items, expense_items];

  currencies.forEach((currency) => {
    incomeAndExpenseItems.forEach((x) => {
      x.currency_breakdown.push({
        currency_id: currency.id,
        amount: 0,
        amount_in_PC: 0,
        percentage: 0,
      });
    });
  });

  const pricePC =
    primaryCurrency === 1
      ? 1
      : prices.find((x) => x.currency_id === primaryCurrency).price;

  for (const current of records) {
    if (!current.amount) continue;
    if (!current.currency_id) {
      const statItem = current.amount > 0 ? income_items : expense_items;
      if (statItem.currency_unassigned_sum !== undefined) {
        statItem.currency_unassigned_sum += parseFloat(current.amount);
      }
      continue;
    }

    const item = (
      current.amount > 0 ? income_items : expense_items
    ).currency_breakdown.find(
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
    (current.amount > 0 ? income_items : expense_items).sum += amountInPC;
  }

  incomeAndExpenseItems.forEach((x) => {
    if (x.sum === 0) {
      x.currency_breakdown = [];
      return;
    }

    x.currency_breakdown.forEach((item) => {
      item.percentage = (item.amount_in_PC / x.sum) * 100;
    });

    const nonZeroItems = x.currency_breakdown.filter((k) => k.amount !== 0);
    const sorted = nonZeroItems.sort(
      x.sum > 0 ? orderDescending : orderAscending
    );
    x.currency_breakdown = sorted;
  });
  recordStats.sum = income_items.sum + expense_items.sum;

  return recordStats;
};
