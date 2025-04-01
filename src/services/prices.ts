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

const getDbPrices = (from: string, to: string, currencyId: string | number) =>
  client
    .query(
      `SELECT * FROM price WHERE date BETWEEN $1 AND $2 AND currency_id = $3`,
      [from, to, currencyId]
    )
    .then((r) => r.rows);

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

const currencyById = (currencyId: string | number) =>
  client
    .query(`SELECT * FROM currency WHERE id = $1`, [currencyId])
    .then((r) => r.rows[0] as Currency);

const updatePrices = async (
  from: string,
  to: string,
  currencyId: string | number
) => {
  const currency = await currencyById(currencyId);
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

export const prices = async (
  from: string,
  to: string,
  currencyId: string | number
) => {
  const data = await getDbPrices(from, to, currencyId);

  if (data.length) return data;
  else return updatePrices(from, to, currencyId);
};
