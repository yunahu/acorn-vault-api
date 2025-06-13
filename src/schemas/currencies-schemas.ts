import { Request } from 'express';
import { z } from 'zod';

export const getPricesSchema = {
  query: z.object({
    from: z.string().date(),
    to: z.string().date(),
    currency_id: z.coerce.number().int().positive(),
  }),
};

export type GetPricesRequest = Request<
  void,
  void,
  void,
  z.infer<typeof getPricesSchema.query>
>;
