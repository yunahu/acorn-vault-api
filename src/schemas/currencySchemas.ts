import { z } from 'zod';

export const getPricesSchema = {
  query: z.object({
    from: z.string().date(),
    to: z.string().date(),
    currencyId: z.coerce.number().int().positive(),
  }),
};

export type GetPricesQuery = z.infer<typeof getPricesSchema.query>;
