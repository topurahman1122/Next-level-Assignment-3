import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { ICow, ICowFilters } from './cow.interface';
import { Cow } from './cow.model';
import { User } from '../user/user.model';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { CowConstant } from './cow.constant';
import { SortOrder } from 'mongoose';
import { IGenericResponse } from '../../../interfaces/common';

const createCow = async (payload: Partial<ICow>): Promise<ICow> => {
  if (!payload.label) {
    payload.label = 'for sale';
  }
  const seller = await User.findById(payload.seller);
  if (!seller) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Seller Not Found!');
  } else if (seller.role !== 'seller') {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Not A Valid Seller!');
  }
  const result = (await Cow.create(payload)).populate('seller');
  return result;
};

const getAllCows = async (
  filters: ICowFilters,
  paginationOptions: IPaginationOptions,
): Promise<IGenericResponse<ICow[]>> => {
  const { query, minPrice, maxPrice, ...filterdData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);
  const andConditions = [];
  const sortCondition: { [key: string]: SortOrder } = {};

  if (query) {
    andConditions.push({
      $or: CowConstant.cowSearchableFields.map(field => ({
        [field]: {
          $regex: query,
          $options: 'i',
        },
      })),
    });
  }

  if (Object.keys(filterdData).length) {
    andConditions.push({
      $and: Object.entries(filterdData).map(([field, value]) => ({
        [field]: value[0].toUpperCase() + value.slice(1),
      })),
    });
  }

  if (sortBy && sortOrder) {
    sortCondition[sortBy] = sortOrder;
  }

  if (minPrice !== undefined) {
    andConditions.push({ price: { $gte: minPrice } });
  }

  if (maxPrice !== undefined) {
    andConditions.push({ price: { $lte: maxPrice } });
  }

  //query example
  // const query = {
  //   $and: [
  //     { $or: [{ category: { $regex: 'beef', $options: 'i' } }] },
  //     { $and: [{ location: 'Sylhet' }, { breed: 'Indigenous' }] },
  //     { price: { $gte: 115000 } },
  //   ],
  // };

  const whereCondition = andConditions.length ? { $and: andConditions } : {};
  const result = await Cow.find(whereCondition)
    .populate('seller')
    .sort(sortCondition)
    .skip(skip)
    .limit(limit);

  const total = await Cow.countDocuments(whereCondition);
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getSingleCow = async (id: string): Promise<ICow | null> => {
  const result = await Cow.findById(id).populate('seller');
  return result;
};

const updateCow = async (
  id: string,
  payload: Partial<ICow>,
): Promise<ICow | null> => {
  const isExist = await Cow.findById(id);
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Cow Not Found!');
  }
  if (payload.seller && payload.seller) {
    const isSeller = await User.findOne({
      _id: payload.seller,
      role: 'seller',
    });
    if (!isSeller) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Not A Valid Seller!');
    }
  }
  const result = await Cow.findByIdAndUpdate(id, payload, {
    new: true,
  }).populate('seller');
  return result;
};

const deleteCow = async (id: string): Promise<ICow | null> => {
  const isExist = await Cow.findById(id);
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Cow Not Found!');
  }
  const result = await Cow.findByIdAndDelete(id).populate('seller');
  return result;
};

export const CowService = {
  createCow,
  getAllCows,
  getSingleCow,
  updateCow,
  deleteCow,
};
