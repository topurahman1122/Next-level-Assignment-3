/* eslint-disable @typescript-eslint/no-explicit-any */
import { SortOrder } from 'mongoose';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IUser, IUserFilters } from './user.interface';
import { User } from './user.model';
import httpStatus from 'http-status';
import { UserConstant } from './user.constant';
import { IGenericResponse } from '../../../interfaces/common';

const createUser = async (userData: IUser): Promise<IUser> => {
  if (userData.role === 'buyer') {
    userData.income = 0;
  } else if (userData.role === 'seller') {
    userData.income = 0;
    userData.budget = 0;
  }
  const result = await User.create(userData);
  return result;
};

const getAllUsers = async (
  filters: IUserFilters,
  paginationOptions: IPaginationOptions,
): Promise<IGenericResponse<IUser[]>> => {
  const { query, minBudget, maxBudget, ...filterdData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andCondition = [];
  const sortCondition: { [key: string]: SortOrder } = {};

  if (query) {
    andCondition.push({
      $or: UserConstant.userSearchableFields.map(field => ({
        [field]: {
          $regex: query,
          $options: 'i',
        },
      })),
    });
  }

  if (Object.keys(filterdData).length) {
    andCondition.push({
      $and: Object.entries(filterdData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  if (minBudget !== undefined) {
    andCondition.push({ budget: { $gte: minBudget } });
  }

  if (maxBudget !== undefined) {
    andCondition.push({ budget: { $lte: maxBudget } });
  }

  if (sortBy && sortOrder) {
    sortCondition[sortBy] = sortOrder;
  }

  const whereCondition = andCondition.length ? { $and: andCondition } : {};
  const result = await User.find(whereCondition)
    .sort(sortCondition)
    .skip(skip)
    .limit(limit);
  const total = await User.countDocuments(whereCondition);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getSingleUser = async (id: string): Promise<IUser> => {
  const result = await User.findById(id);
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User Not Found');
  }
  return result;
};

const updateUser = async (
  id: string,
  payload: Partial<IUser>,
): Promise<IUser | null> => {
  const isExist = await User.findById(id);

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User Not Found!');
  }

  const { name, ...restData } = payload;
  const updatedUserData: Partial<IUser> = { ...restData };

  if (name && Object.keys(name).length > 0) {
    Object.keys(name).forEach(key => {
      const nameKey = `name.${key}` as keyof Partial<IUser>;
      (updatedUserData as any)[nameKey] = name[key as keyof typeof name];
    });
  }

  const result = await User.findByIdAndUpdate(id, updatedUserData, {
    new: true,
  });
  return result;
};

const deleteUser = async (id: string): Promise<IUser | null> => {
  const result = await User.findByIdAndDelete(id);
  return result;
};

export const UserService = {
  createUser,
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
};
