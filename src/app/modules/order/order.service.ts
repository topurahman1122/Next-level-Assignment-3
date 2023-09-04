import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { Cow } from '../cow/cow.model';
import { IOrder } from './order.interface';
import { User } from '../user/user.model';
import mongoose, { SortOrder } from 'mongoose';
import { Order } from './order.model';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';

const createOrder = async (payload: Partial<IOrder>): Promise<IOrder> => {
  const { cow: cowId, buyer: buyerId } = payload;
  let result;

  //Transction & Rollback
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    // Get the buyer and cow details within the transaction
    const buyer = await User.findById(buyerId).session(session);
    const cow = await Cow.findById(cowId).session(session);

    // Check if buyer and cow exist
    if (!buyer || !cow) {
      throw new ApiError(httpStatus.NOT_FOUND, `Buyer Or Cow Not Found!`);
    }

    // Check if cow is for sell
    if (cow.label === 'sold out') {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Cow is already sold out');
    }

    // Check if buyer has enough money to buy the cow
    if (buyer.budget < cow.price) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Buyer doesn't have enough money",
      );
    }

    // Update cow's label to 'sold out'
    await Cow.findByIdAndUpdate(cowId, { label: 'sold out' }, { session });

    // Deduct the cost of the cow from the buyer's budget
    await User.findByIdAndUpdate(
      buyerId,
      { $inc: { budget: -cow.price } },
      { session },
    );

    // Add the same amount to the seller's income
    await User.findByIdAndUpdate(
      cow.seller,
      { $inc: { income: cow.price } },
      { session },
    );

    // Create an entry in the orders collection
    const newOrder = await Order.create([payload], { session });
    result = await newOrder[0].populate([
      { path: 'cow', populate: ['seller'] },
      { path: 'buyer' },
    ]);

    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
  return result;
};

const getAllOrders = async (
  paginationOptions: IPaginationOptions,
): Promise<IGenericResponse<IOrder[]>> => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);
  const sortCondition: { [key: string]: SortOrder } = {};

  if (sortBy && sortOrder) {
    sortCondition[sortBy] = sortOrder;
  }
  const result = await Order.find()
    .populate([{ path: 'cow', populate: ['seller'] }, { path: 'buyer' }])
    .sort(sortCondition)
    .skip(skip)
    .limit(limit);
  const total = await Order.countDocuments();
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

export const OrderService = {
  createOrder,
  getAllOrders,
};
