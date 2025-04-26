import axios from 'axios';
import client from 'src/services/postgres';

interface Currency {
  id: number;
  code: string;
  symbol: string;
  name: string;
}

interface Rates {
  [key: string]: {
    [key: string]: number;
  };
}

export const getDbCurrencies = async () =>
  client.query(`SELECT * FROM currency`).then((r) => r.rows);

export const getDbCurrencyById = (currencyId: string | number) =>
  client
    .query(`SELECT * FROM currency WHERE id = $1`, [currencyId])
    .then((r) => r.rows[0] as Currency);

const getApiPrices = (
  from: string,
  to: string,
  currencyCode: string | number
) =>
  axios
    .get(
      `https://api.frankfurter.dev/v1/${from}..${to}?base=USD&symbols=${currencyCode}`
    )
    .then((r) => r.data.rates as Rates[]);

const updatePrices = async (
  from: string,
  to: string,
  currencyId: string | number
) => {
  const currency = await getDbCurrencyById(currencyId);
  if (!currency) throw new Error('Invalid currency id');

  const rates = await getApiPrices(from, to, currency.code);

  const reformatted = [];
  for (const [date, { [currency.code]: rate }] of Object.entries(rates)) {
    reformatted.push({
      currencyId: currency.id,
      date,
      rate,
    });
  }

  const query = `INSERT INTO price (currency_id, date, price) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING`;
  for (const { currencyId, date, rate } of reformatted) {
    try {
      client.query(query, [currencyId, date, rate]);
    } catch (err) {
      console.error(err);
    }
  }

  return reformatted;
};

export const getDbPrices = async (
  from: string,
  to: string,
  currencyId: string | number
) => {
  const prices = await client
    .query(
      `SELECT * FROM price WHERE date BETWEEN $1 AND $2 AND currency_id = $3`,
      [from, to, currencyId]
    )
    .then((r) => r.rows);

  if (prices.length) return prices;
  else return updatePrices(from, to, currencyId);
};

export const getLatestPrices = async () =>
  client
    .query(
      `SELECT DISTINCT ON (currency_id) currency_id, price
			FROM price
			ORDER BY currency_id, date DESC;`
    )
    .then((r) => r.rows);
