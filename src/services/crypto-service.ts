import axios from 'axios';
import { Currency } from 'src/services/currencies-service';
import client from 'src/services/postgres-service';
import { getPrimaryCurrency } from 'src/services/user-service';
import env from 'src/utils/env';

interface CoingeckoResponse {
  [coingecko_api_id: string]: {
    [currency_code: string]: number;
  };
}

interface Prices {
  [coingecko_api_id: string]: number;
}

export const getCoins = () =>
  client.query(`SELECT * FROM coin`).then((r) => r.rows);

const getCoingeckoPrices = async (currencyCode: string) => {
  const coinIds: string[] = await client
    .query(`SELECT coingecko_api_id FROM coin`)
    .then((r) => r.rows.map((x) => x.coingecko_api_id));

  const options = {
    method: 'GET',
    url: `https://api.coingecko.com/api/v3/simple/price?ids=${coinIds.join(',')}&vs_currencies=${currencyCode}`,
    headers: {
      accept: 'application/json',
      'x-cg-demo-api-key': env.COINGECKO_API_KEY,
    },
  };

  const coingeckoPrices = await axios
    .request<any, { data: CoingeckoResponse }>(options)
    .then((x) => x.data)
    .catch((err) => console.error(err));

  if (!coingeckoPrices) return;

  const prices: Prices = {};

  coinIds.forEach((coin) => {
    prices[coin] = coingeckoPrices[coin][currencyCode.toLowerCase()];
  });

  return prices;
};

export const getCoinPrices = async (uid: string) => {
  const primaryCurrency: Currency = await getPrimaryCurrency(uid);
  const prices = await getCoingeckoPrices(primaryCurrency.code.toLowerCase());

  return prices ? { currency: primaryCurrency, prices } : undefined;
};
