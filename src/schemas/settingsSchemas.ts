import { z } from 'zod';

export const updateSettingsSchema = {
  body: z.object({
    primary_currency: z.number().int().positive().optional(),
  }),
};
