import { z } from 'zod';

const createOrderZodSchema = z.object({
  body: z.object({
    cow: z.string({
      required_error: 'Cow Ref _id Required',
      invalid_type_error: 'Cow Ref _id must be a string',
    }),
    buyer: z.string({
      required_error: 'Buyer Ref _id Required',
      invalid_type_error: 'Buyer Ref _id must be a string',
    }),
  }),
});

export const OrderValidation = {
  createOrderZodSchema,
};
