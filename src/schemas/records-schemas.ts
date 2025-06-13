import { Request } from 'express';
import { z } from 'zod';

export const createRecordSchema = {
  body: z.object({
    date: z.string().datetime(),
    description: z.string().optional(),
    account_id: z.number().int().positive().nullable().optional(),
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
  params: z.object({
    id: z.coerce.number().int().positive(),
  }),
  body: z.object({
    date: z.string().datetime().optional(),
    description: z.string().optional(),
    account_id: z.number().int().positive().nullable().optional(),
    amount: z.number().optional(),
  }),
};

export const deleteRecordSchema = {
  params: z.object({
    id: z.coerce.number().int().positive(),
  }),
};

export type CreateRecordRequest = Request<
  void,
  void,
  z.infer<typeof createRecordSchema.body>,
  void
>;

export type GetRecordsRequest = Request<
  void,
  void,
  void,
  z.infer<typeof getRecordsSchema.query>
>;

export type UpdateRecordBody = z.infer<typeof updateRecordSchema.body>;
export type UpdateRecordRequest = Request<
  z.infer<typeof updateRecordSchema.params>,
  void,
  UpdateRecordBody,
  void
>;

export type DeleteRecordRequest = Request<
  z.infer<typeof deleteRecordSchema.params>,
  void,
  void,
  void
>;
