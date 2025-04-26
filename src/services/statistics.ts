import { getDbAccounts } from 'src/services/accounts';
import { getLatestPrices } from 'src/services/currencies';
import { getPrimaryCurrency } from 'src/services/settings';

export const calculateNetWorth = async (uid: string) => {
  const accounts = await getDbAccounts(uid);
  if (!accounts) {
    return undefined;
  }

  const primaryCurrency = await getPrimaryCurrency(uid);

  if (!accounts.length) {
    return {
      currency_id: primaryCurrency,
      amount: 0,
    };
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

  return {
    currency_id: primaryCurrency,
    amount,
  };
};
