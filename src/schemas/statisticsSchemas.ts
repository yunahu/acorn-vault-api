import { z } from 'zod';

export const getRecordStatsSchema = {
  query: z.object({
    from: z.string().date().optional(),
    to: z.string().date().optional(),
  }),
};

export type getRecordStatsQuery = z.infer<typeof getRecordStatsSchema.query>;
