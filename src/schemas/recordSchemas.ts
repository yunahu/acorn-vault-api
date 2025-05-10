import { z } from 'zod';

export const createRecordSchema = {
  body: z.object({
    date: z.string().datetime(),
    description: z.string().optional(),
    currencyId: z.number().int().positive().optional(),
    amount: z.number().optional(),
  }),
};

export const getRecordsSchema = {
  query: z.object({
    from: z.string().date().optional(),
    to: z.string().date().optional(),
  }),
};

export const updateRecordSchema = {
  body: z.object({
    date: z.string().datetime().optional(),
    description: z.string().optional(),
    account_id: z.number().int().positive().optional(),
    amount: z.number().optional(),
  }),
};

export const deleteRecordSchema = {
  params: z.object({
    id: z.coerce.number().int().positive(),
  }),
};

export type GetRecordsQuery = z.infer<typeof getRecordsSchema.query>;
