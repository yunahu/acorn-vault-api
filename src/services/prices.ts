import client from "src/services/postgres";

export const prices = async (from: string, to: string, currency_id: string) =>
  client
    .query(
      `SELECT * FROM price WHERE date >= $1 AND date <= $2 AND currency_id = $3`,
      [from, to, currency_id]
    )
    .then((r) => r.rows);
