import { Request } from 'express';
import { z } from 'zod';

export const updateUserSettingsSchema = {
  body: z.object({
    primary_currency_id: z.number().int().positive().optional(),
  }),
};

export type UpdateUserSettingsRequest = Request<
  void,
  void,
  z.infer<typeof updateUserSettingsSchema.body>,
  void
>;
