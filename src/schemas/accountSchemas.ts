import { z } from 'zod';

export const createAccountSchema = {
  body: z
    .object({
      name: z.string().min(1),
      currencyId: z.number().int().positive(),
      balance: z.number().optional(),
      isPrimaryPaymentMethod: z.boolean().optional(),
    })
    .superRefine(({ name }, ctx) => {
      if (name && name.trim() === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Name cannot be an empty string',
        });
      }
    }),
};

export const updateAccountSchema = {
  body: z
    .object({
      name: z.string().min(1).optional(),
      balance: z.number().optional(),
      is_primary_payment_method: z.boolean().optional(),
    })
    .superRefine(({ name }, ctx) => {
      if (name && name.trim() === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Name cannot be an empty string',
        });
      }
    }),
};

export const deleteAccountSchema = {
  params: z.object({
    id: z.coerce.number().int().positive(),
  }),
};
