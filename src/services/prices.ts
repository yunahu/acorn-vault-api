import axios from 'axios';
import client from 'src/services/postgres';
import { retry, timeoutablePromise } from 'src/utils/helpers';

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

const getDbPrices = (from: string, to: string, currency_id: string | number) =>
  retry(() =>
    timeoutablePromise(
      client
        .query(
          `SELECT * FROM price WHERE date BETWEEN $1 AND $2 AND currency_id = $3`,
          [from, to, currency_id]
        )
        .then((r) => r.rows)
    )
  );

const getApiPrices = (
  from: string,
  to: string,
  currency_code: string | number
) =>
  retry(() =>
    timeoutablePromise(
      axios
        .get(
          `https://api.frankfurter.dev/v1/${from}..${to}?base=USD&symbols=${currency_code}`
        )
        .then((r) => r.data.rates as Rates[])
    )
  );

const currencyById = (currency_id: string | number) =>
  retry(() =>
    timeoutablePromise(
      client
        .query(`SELECT * FROM currency WHERE id = $1`, [currency_id])
        .then((r) => r.rows[0] as Currency)
    )
  );

const updatePrices = async (
  from: string,
  to: string,
  currency_id: string | number
) => {
  const currency = await currencyById(currency_id);
  if (!currency) throw new Error('Invalid currency_id');

  const rates = await getApiPrices(from, to, currency.code);

  const reformatted = [];
  for (const [date, { [currency.code]: rate }] of Object.entries(rates)) {
    reformatted.push({
      currency_id: currency.id,
      date,
      rate,
    });
  }

  const query = `INSERT INTO price (currency_id, date, price) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING`;
  for (const { currency_id, date, rate } of reformatted) {
    try {
      retry(() =>
        timeoutablePromise(client.query(query, [currency_id, date, rate]))
      );
    } catch (err) {
      console.error(err);
    }
  }

  return reformatted;
};

export const prices = async (
  from: string,
  to: string,
  currency_id: string | number
) => {
  const data = await getDbPrices(from, to, currency_id);

  if (data.length) return data;
  else return updatePrices(from, to, currency_id);
};
