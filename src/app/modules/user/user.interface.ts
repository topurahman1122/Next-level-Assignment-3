import { Model } from 'mongoose';

type UserName = {
  firstName: string;
  lastName: string;
};

export type IUser = {
  password: string;
  role: 'seller' | 'buyer';
  name: UserName;
  phoneNumber: string;
  address: string;
  budget: number;
  income: number;
};

export type IUserFilters = {
  query?: string;
  phoneNumber?: string;
  minBudget?: number;
  maxBudget?: number;
};

export type UserModel = Model<IUser, Record<string, unknown>>;
