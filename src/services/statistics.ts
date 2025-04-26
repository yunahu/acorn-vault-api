import { settings } from 'src/services/settings';
import { latestPricesAll } from 'src/services/currencies';
import { accounts } from 'src/services/accounts';

export const netWorth = async (uid: string) => {
  const data = await accounts(uid);
  if (!data) {
    return undefined;
  }

  const primaryCurrency = await settings(uid).then((x) => x?.primary_currency);

  if (!data.length) {
    return {
      currency_id: primaryCurrency,
      amount: 0,
    };
  }

  const prices = await latestPricesAll();
  const amountUSD = data.reduce((acc, current) => {
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
