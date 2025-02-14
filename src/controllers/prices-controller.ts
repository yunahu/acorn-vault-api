import { Request, Response } from "express";
import { prices } from "src/services/prices";

export const getPrices = async (req: Request, res: Response) => {
  const { from, to, currency_id } = req.query;

  const data = await prices(
    from as string,
    to as string,
    currency_id as string
  );

  res.send(data);
};
