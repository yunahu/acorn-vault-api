import { Request } from 'express';
import { z } from 'zod';

export const getRecordStatsSchema = {
  query: z.object({
    from: z.string().date().optional(),
    to: z.string().date().optional(),
  }),
};

export type GetRecordStatsRequest = Request<
  void,
  void,
  void,
  z.infer<typeof getRecordStatsSchema.query>
>;
