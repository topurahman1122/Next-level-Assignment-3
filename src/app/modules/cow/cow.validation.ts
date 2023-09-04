import { z } from 'zod';
import { CowConstant } from './cow.constant';

const createCowZodSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Name is required' }),
    age: z.number({ required_error: 'Age is required' }),
    price: z.number({
      required_error: 'Price is required',
      invalid_type_error: 'Price must be a number',
    }),
    location: z.enum([...CowConstant.location] as [string, ...string[]], {
      required_error: 'Location is required',
    }),
    breed: z.enum([...CowConstant.breed] as [string, ...string[]], {
      required_error: 'Breed is required',
    }),
    weight: z.number({
      required_error: 'Weight is required',
      invalid_type_error: 'Weight must be a number',
    }),
    label: z.enum([...CowConstant.label] as [string, ...string[]], {
      required_error: 'Label is required',
    }),
    category: z.enum([...CowConstant.category] as [string, ...string[]], {
      required_error: 'Category is required',
    }),
    seller: z.string({ required_error: 'Seller id is reuired' }),
  }),
});

const updateCowZodSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    age: z.number().optional(),
    price: z
      .number({
        invalid_type_error: 'Price must be a number',
      })
      .optional(),
    location: z
      .enum([...CowConstant.location] as [string, ...string[]])
      .optional(),
    breed: z.enum([...CowConstant.breed] as [string, ...string[]]).optional(),
    weight: z
      .number({
        invalid_type_error: 'Weight must be a number',
      })
      .optional(),
    label: z.enum([...CowConstant.label] as [string, ...string[]]).optional(),
    category: z
      .enum([...CowConstant.category] as [string, ...string[]])
      .optional(),
    seller: z.string().optional(),
  }),
});

export const CowValidation = {
  createCowZodSchema,
  updateCowZodSchema,
};
