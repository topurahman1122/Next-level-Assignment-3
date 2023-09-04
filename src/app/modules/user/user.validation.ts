import { z } from 'zod';
import { UserConstant } from './user.constant';

const createUserZodSchema = z.object({
  body: z.object({
    password: z.string().optional(),
    role: z.enum([...UserConstant.role] as [string, ...string[]], {
      required_error: 'Role is required',
    }),
    name: z.object({
      firstName: z.string({ required_error: 'First Name is required' }),
      lastName: z.string({ required_error: 'Last Name is required' }),
    }),
    phoneNumber: z.string({ required_error: 'Phone Number is required' }),
    address: z.string({ required_error: 'Address is required' }),
    budget: z.number({
      required_error: 'Budged is required',
      invalid_type_error: 'Budget must be a number',
    }),
    income: z
      .number({ invalid_type_error: 'Income must be a number' })
      .optional(),
  }),
});

const updateUserZodValidation = z.object({
  body: z.object({
    password: z.string({ required_error: 'Password is required' }).optional(),
    role: z
      .enum([...UserConstant.role] as [string, ...string[]], {
        required_error: 'Role is required',
      })
      .optional(),
    name: z
      .object({
        firstName: z
          .string({ required_error: 'First Name is required' })
          .optional(),
        lastName: z
          .string({ required_error: 'Last Name is required' })
          .optional(),
      })
      .optional(),
    phoneNumber: z
      .string({ required_error: 'Phone Number is required' })
      .optional(),
    address: z.string({ required_error: 'Address is required' }).optional(),
    budget: z
      .number({
        required_error: 'Budged is required',
        invalid_type_error: 'Budget must be a number',
      })
      .optional(),
    income: z
      .number({ invalid_type_error: 'Income must be a number' })
      .optional(),
  }),
});

export const UserValidation = {
  createUserZodSchema,
  updateUserZodValidation,
};
