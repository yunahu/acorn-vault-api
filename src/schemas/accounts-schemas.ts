import { Request } from 'express';
import { z } from 'zod';

export const createAccountSchema = {
  body: z
    .object({
      name: z.string().min(1),
      currency_id: z.number().int().positive(),
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

export const updateAccountSchema = {
  params: z.object({
    id: z.coerce.number().int().positive(),
  }),
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

export type CreateAccountRequest = Request<
  void,
  void,
  z.infer<typeof createAccountSchema.body>,
  void
>;

export type UpdateAccountBody = z.infer<typeof updateAccountSchema.body>;
export type UpdateAccountRequest = Request<
  z.infer<typeof updateAccountSchema.params>,
  void,
  UpdateAccountBody,
  void
>;

export type DeleteAccountRequest = Request<
  z.infer<typeof deleteAccountSchema.params>,
  void,
  void,
  void
>;
